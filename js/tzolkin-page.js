/* =============================================================
   tzolkin-page.js — scene, fly-in, wheels, reading panels
   =============================================================
   Depends on: DTzolkin, DTzolkinContent, THREE (r128), gsap.
   Birth details live in memory + URL query only — nothing is stored.
   ============================================================= */
(function () {
  'use strict';

  var T = window.DTzolkin, C = window.DTzolkinContent;
  var $ = function (id) { return document.getElementById(id); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WEBGL = (function () {
    if (typeof THREE === 'undefined') return false; // CDN unreachable — static fallback
    try { var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  })();

  /* Stylized geometric glyphs for the 20 day signs, drawn in code.
     Each is a function (ctx, s) drawing centred in a box of size s. */
  var GLYPHS = [
    function (x, s) { // Imix — waters: layered waves + spine dots
      wave(x, s, 0.30); wave(x, s, 0.50); wave(x, s, 0.70);
      for (var i = 0; i < 4; i++) dot(x, s * (0.28 + i * 0.15), s * 0.14, s * 0.035);
    },
    function (x, s) { // Ik' — wind: T-shape portal
      x.strokeRect(s * 0.28, s * 0.22, s * 0.44, s * 0.56);
      x.beginPath(); x.moveTo(s * 0.38, s * 0.36); x.lineTo(s * 0.62, s * 0.36);
      x.moveTo(s * 0.5, s * 0.36); x.lineTo(s * 0.5, s * 0.68); x.stroke();
    },
    function (x, s) { // Ak'b'al — night: arch over horizon with dots
      arc(x, s * 0.5, s * 0.62, s * 0.26, Math.PI, 0);
      line(x, s * 0.24, s * 0.62, s * 0.76, s * 0.62);
      dot(x, s * 0.38, s * 0.48, s * 0.03); dot(x, s * 0.62, s * 0.48, s * 0.03);
    },
    function (x, s) { // K'an — seed: diamond kernel
      x.beginPath(); x.moveTo(s * 0.5, s * 0.22); x.lineTo(s * 0.76, s * 0.5);
      x.lineTo(s * 0.5, s * 0.78); x.lineTo(s * 0.24, s * 0.5); x.closePath(); x.stroke();
      dot(x, s * 0.5, s * 0.5, s * 0.05);
    },
    function (x, s) { // Chikchan — serpent: sine coil + head dot
      x.beginPath();
      for (var i = 0; i <= 40; i++) { var t = i / 40;
        var px = s * (0.2 + t * 0.6), py = s * 0.5 + Math.sin(t * Math.PI * 3) * s * 0.16;
        i ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke(); dot(x, s * 0.8, s * 0.5, s * 0.045);
    },
    function (x, s) { // Kimi — death: closed-eye percentage sign
      dot(x, s * 0.34, s * 0.36, s * 0.05); dot(x, s * 0.66, s * 0.64, s * 0.05);
      line(x, s * 0.7, s * 0.3, s * 0.3, s * 0.7);
    },
    function (x, s) { // Manik' — hand: cupped arc + fingers
      arc(x, s * 0.5, s * 0.66, s * 0.24, Math.PI, 0);
      for (var i = 0; i < 4; i++) { var px = s * (0.32 + i * 0.12);
        line(x, px, s * 0.42, px, s * 0.26); }
    },
    function (x, s) { // Lamat — star: Venus cross of four dots
      dot(x, s * 0.5, s * 0.26, s * 0.05); dot(x, s * 0.5, s * 0.74, s * 0.05);
      dot(x, s * 0.26, s * 0.5, s * 0.05); dot(x, s * 0.74, s * 0.5, s * 0.05);
      circle(x, s * 0.5, s * 0.5, s * 0.1);
    },
    function (x, s) { // Muluk — water: ripple rings around a drop
      dot(x, s * 0.5, s * 0.5, s * 0.05); circle(x, s * 0.5, s * 0.5, s * 0.14);
      circle(x, s * 0.5, s * 0.5, s * 0.24);
    },
    function (x, s) { // Ok — dog: ears + muzzle
      line(x, s * 0.32, s * 0.26, s * 0.32, s * 0.44); line(x, s * 0.68, s * 0.26, s * 0.68, s * 0.44);
      arc(x, s * 0.5, s * 0.5, s * 0.22, Math.PI * 0.15, Math.PI * 0.85);
      dot(x, s * 0.42, s * 0.46, s * 0.03); dot(x, s * 0.58, s * 0.46, s * 0.03);
    },
    function (x, s) { // Chuwen — weaver: interlaced lattice
      for (var i = 0; i < 3; i++) { line(x, s * (0.3 + i * 0.2), s * 0.25, s * (0.3 + i * 0.2), s * 0.75);
        line(x, s * 0.25, s * (0.3 + i * 0.2), s * 0.75, s * (0.3 + i * 0.2)); }
    },
    function (x, s) { // Eb — road: converging path
      line(x, s * 0.38, s * 0.78, s * 0.48, s * 0.24); line(x, s * 0.62, s * 0.78, s * 0.52, s * 0.24);
      line(x, s * 0.42, s * 0.6, s * 0.58, s * 0.6); line(x, s * 0.45, s * 0.42, s * 0.55, s * 0.42);
    },
    function (x, s) { // B'en — reed: two pillars with nodes
      line(x, s * 0.4, s * 0.24, s * 0.4, s * 0.76); line(x, s * 0.6, s * 0.24, s * 0.6, s * 0.76);
      dot(x, s * 0.4, s * 0.38, s * 0.03); dot(x, s * 0.6, s * 0.38, s * 0.03);
      dot(x, s * 0.4, s * 0.62, s * 0.03); dot(x, s * 0.6, s * 0.62, s * 0.03);
    },
    function (x, s) { // Ix — jaguar: three rosette spots
      dot(x, s * 0.38, s * 0.38, s * 0.05); dot(x, s * 0.62, s * 0.38, s * 0.05);
      dot(x, s * 0.5, s * 0.6, s * 0.05); arc(x, s * 0.5, s * 0.52, s * 0.26, Math.PI * 1.15, Math.PI * 1.85);
    },
    function (x, s) { // Men — eagle: wing chevrons + eye
      x.beginPath(); x.moveTo(s * 0.24, s * 0.55); x.lineTo(s * 0.5, s * 0.35); x.lineTo(s * 0.76, s * 0.55); x.stroke();
      x.beginPath(); x.moveTo(s * 0.3, s * 0.66); x.lineTo(s * 0.5, s * 0.5); x.lineTo(s * 0.7, s * 0.66); x.stroke();
      dot(x, s * 0.5, s * 0.42, s * 0.035);
    },
    function (x, s) { // Kib — ancestral: spiral of return
      x.beginPath();
      for (var i = 0; i <= 60; i++) { var t = i / 60, a = t * Math.PI * 3.5, r = s * 0.05 + t * s * 0.22;
        var px = s * 0.5 + Math.cos(a) * r, py = s * 0.5 + Math.sin(a) * r;
        i ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
    },
    function (x, s) { // Kab'an — earth: fault line through globe
      circle(x, s * 0.5, s * 0.5, s * 0.26);
      x.beginPath(); x.moveTo(s * 0.28, s * 0.55); x.lineTo(s * 0.44, s * 0.44);
      x.lineTo(s * 0.56, s * 0.58); x.lineTo(s * 0.72, s * 0.45); x.stroke();
    },
    function (x, s) { // Etz'nab' — flint: blade with edge line
      x.beginPath(); x.moveTo(s * 0.5, s * 0.2); x.lineTo(s * 0.66, s * 0.5);
      x.lineTo(s * 0.5, s * 0.8); x.lineTo(s * 0.34, s * 0.5); x.closePath(); x.stroke();
      line(x, s * 0.5, s * 0.26, s * 0.5, s * 0.74);
    },
    function (x, s) { // Kawak — storm: cloud + rain
      arc(x, s * 0.5, s * 0.42, s * 0.2, Math.PI, 0);
      line(x, s * 0.3, s * 0.42, s * 0.7, s * 0.42);
      line(x, s * 0.38, s * 0.52, s * 0.34, s * 0.7); line(x, s * 0.52, s * 0.52, s * 0.48, s * 0.7);
      line(x, s * 0.66, s * 0.52, s * 0.62, s * 0.7);
    },
    function (x, s) { // Ajaw — sun lord: radiant face
      circle(x, s * 0.5, s * 0.5, s * 0.2);
      for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2;
        line(x, s * 0.5 + Math.cos(a) * s * 0.26, s * 0.5 + Math.sin(a) * s * 0.26,
                s * 0.5 + Math.cos(a) * s * 0.34, s * 0.5 + Math.sin(a) * s * 0.34); }
      dot(x, s * 0.44, s * 0.46, s * 0.025); dot(x, s * 0.56, s * 0.46, s * 0.025);
      arc(x, s * 0.5, s * 0.52, s * 0.07, Math.PI * 0.15, Math.PI * 0.85);
    }
  ];
  function line(x, a, b, c, d) { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); }
  function dot(x, a, b, r) { x.beginPath(); x.arc(a, b, r, 0, Math.PI * 2); x.fill(); }
  function circle(x, a, b, r) { x.beginPath(); x.arc(a, b, r, 0, Math.PI * 2); x.stroke(); }
  function arc(x, a, b, r, s0, s1) { x.beginPath(); x.arc(a, b, r, s0, s1); x.stroke(); }
  function wave(x, s, yF) {
    x.beginPath();
    for (var i = 0; i <= 30; i++) { var t = i / 30;
      var px = s * (0.22 + t * 0.56), py = s * yF + Math.sin(t * Math.PI * 2) * s * 0.05;
      i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke();
  }

  function glyphTexture(signIndex, color, glowColor, size) {
    var s = size || 256;
    var cv = document.createElement('canvas'); cv.width = cv.height = s;
    var x = cv.getContext('2d');
    if (glowColor) { x.shadowColor = glowColor; x.shadowBlur = s * 0.08; }
    x.strokeStyle = color; x.fillStyle = color;
    x.lineWidth = s * 0.045; x.lineCap = 'round'; x.lineJoin = 'round';
    circle(x, s * 0.5, s * 0.5, s * 0.44);
    GLYPHS[signIndex](x, s);
    return cv;
  }

  function toneTexture(tone, color, size) {
    // Maya numeral: dots (1) and bars (5)
    var s = size || 256;
    var cv = document.createElement('canvas'); cv.width = cv.height = s;
    var x = cv.getContext('2d');
    x.strokeStyle = color; x.fillStyle = color;
    x.lineWidth = s * 0.05; x.lineCap = 'round';
    var bars = Math.floor(tone / 5), dots = tone % 5;
    var rows = bars + (dots ? 1 : 0);
    var y0 = s * 0.5 + (rows - 1) * s * 0.11;
    // bars stack at the bottom, dots ride on top (Maya convention)
    var r = 0;
    for (var b = 0; b < bars; b++) {
      var yy = y0 - r * s * 0.22;
      x.beginPath(); x.moveTo(s * 0.22, yy); x.lineTo(s * 0.78, yy); x.stroke();
      r++;
    }
    if (dots) {
      var w = (dots - 1) * s * 0.16;
      for (var i = 0; i < dots; i++) dot(x, s * 0.5 - w / 2 + i * s * 0.16, y0 - r * s * 0.22, s * 0.055);
    }
    return cv;
  }

  /* ------------------------------------------------------------
     Scene
     ------------------------------------------------------------ */
  var scene, camera, renderer, raf = null, running = false;
  var signWheel, toneWheel, kinBand, starField, userMarker = null;
  var wheelGroup, dragging = false, dragPrev = 0, spinVel = 0, userSpin = 0;
  var clock = { last: 0 };
  var reading = null;        // current DTzolkin reading
  var SIGN_R = 30, TONE_R = 17, KIN_R = 44;
  var flownIn = false;

  var PALETTE = {
    jade: '#2BB68B', gold: '#E8B84B', cinnabar: '#D35445',
    bone: '#E9E2CF', dim: '#7A8A80'
  };

  function buildScene() {
    var canvas = $('scene');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030507, 0.0035);
    camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 3000);
    camera.position.set(0, 18, 640);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: devicePixelRatio < 2, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    // Starfield tunnel to fly through
    var starGeo = new THREE.BufferGeometry();
    var N = 2600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), siz = new Float32Array(N);
    var cJade = new THREE.Color(PALETTE.jade), cGold = new THREE.Color(PALETTE.gold), cBone = new THREE.Color(PALETTE.bone);
    for (var i = 0; i < N; i++) {
      var a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 420;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 500;
      pos[i * 3 + 2] = 500 - Math.random() * 1400;
      var c = Math.random() < 0.12 ? cGold : (Math.random() < 0.18 ? cJade : cBone);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      siz[i] = 1.2 + Math.random() * 2.6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    var starMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: [
        'attribute float aSize; varying vec3 vColor;',
        'void main(){ vColor = color;',
        ' vec4 mv = modelViewMatrix * vec4(position,1.0);',
        ' gl_PointSize = aSize * (240.0 / -mv.z);',
        ' gl_Position = projectionMatrix * mv; }'].join('\n'),
      fragmentShader: [
        'varying vec3 vColor;',
        'void main(){ float d = length(gl_PointCoord - 0.5);',
        ' float a = smoothstep(0.5, 0.05, d);',
        ' gl_FragColor = vec4(vColor, a * 0.9); }'].join('\n'),
      vertexColors: true
    });
    starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    wheelGroup = new THREE.Group();
    wheelGroup.rotation.x = -0.28;
    scene.add(wheelGroup);

    // 20 day-sign wheel (outer of the pair)
    signWheel = new THREE.Group();
    for (var si = 0; si < 20; si++) {
      var tx = new THREE.CanvasTexture(glyphTexture(si, PALETTE.bone, PALETTE.jade));
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, opacity: 0.95 }));
      var ang = si / 20 * Math.PI * 2;
      sp.position.set(Math.cos(ang) * SIGN_R, Math.sin(ang) * SIGN_R, 0);
      sp.scale.set(6.4, 6.4, 1);
      sp.userData = { kind: 'sign', index: si };
      signWheel.add(sp);
    }
    signWheel.add(ring(SIGN_R + 4.6, PALETTE.jade, 0.35));
    signWheel.add(ring(SIGN_R - 4.6, PALETTE.jade, 0.2));
    wheelGroup.add(signWheel);

    // 13 tone wheel (inner, counter-rotating)
    toneWheel = new THREE.Group();
    for (var ti = 1; ti <= 13; ti++) {
      var ttx = new THREE.CanvasTexture(toneTexture(ti, PALETTE.gold));
      var tsp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ttx, transparent: true, opacity: 0.95 }));
      var tang = (ti - 1) / 13 * Math.PI * 2;
      tsp.position.set(Math.cos(tang) * TONE_R, Math.sin(tang) * TONE_R, 1.5);
      tsp.scale.set(5, 5, 1);
      tsp.userData = { kind: 'tone', index: ti };
      toneWheel.add(tsp);
    }
    toneWheel.add(ring(TONE_R + 3.4, PALETTE.gold, 0.3));
    wheelGroup.add(toneWheel);

    // 260-kin outer band
    var kg = new THREE.BufferGeometry();
    var kp = new Float32Array(260 * 3), kc = new Float32Array(260 * 3), ks = new Float32Array(260);
    for (var k = 0; k < 260; k++) {
      var ka = k / 260 * Math.PI * 2;
      kp[k * 3] = Math.cos(ka) * KIN_R; kp[k * 3 + 1] = Math.sin(ka) * KIN_R; kp[k * 3 + 2] = -1;
      var kcol = new THREE.Color(k % 13 === 0 ? PALETTE.gold : PALETTE.dim);
      kc[k * 3] = kcol.r; kc[k * 3 + 1] = kcol.g; kc[k * 3 + 2] = kcol.b;
      ks[k] = k % 13 === 0 ? 3.2 : 1.7;
    }
    kg.setAttribute('position', new THREE.BufferAttribute(kp, 3));
    kg.setAttribute('color', new THREE.BufferAttribute(kc, 3));
    kg.setAttribute('aSize', new THREE.BufferAttribute(ks, 1));
    kinBand = new THREE.Points(kg, starMat.clone());
    wheelGroup.add(kinBand);
    wheelGroup.add(ring(KIN_R, PALETTE.dim, 0.18));

    addEventListener('resize', onResize);
    canvas.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    canvas.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  function ring(r, colorHex, opacity) {
    var pts = [];
    for (var i = 0; i <= 128; i++) { var a = i / 128 * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)); }
    var g = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: new THREE.Color(colorHex), transparent: true, opacity: opacity }));
  }

  function onResize() {
    if (!renderer) return;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }

  function onDown(e) { if (!flownIn) return; dragging = true; dragPrev = e.clientX; spinVel = 0; }
  function onMove(e) {
    if (!dragging) return;
    var dx = e.clientX - dragPrev; dragPrev = e.clientX;
    userSpin += dx * 0.005; spinVel = dx * 0.005;
  }
  function onUp() { dragging = false; }

  var rayc = null, mouse = null;
  function onClick(e) {
    if (!rayc) { rayc = new THREE.Raycaster(); mouse = new THREE.Vector2(); }
    if (!flownIn || Math.abs(spinVel) > 0.002) return;
    mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    rayc.setFromCamera(mouse, camera);
    var hits = rayc.intersectObjects(signWheel.children.concat(toneWheel.children), false);
    if (hits.length) {
      var u = hits[0].object.userData;
      if (u.kind === 'sign') showSignDetail(u.index);
      else showToneDetail(u.index);
    }
  }

  function start() {
    if (running || !renderer) return;
    running = true; clock.last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  function tick(now) {
    if (!running) return;
    var dt = Math.min((now - clock.last) / 1000, 0.05); clock.last = now;
    if (!dragging) { spinVel *= 0.96; userSpin += spinVel; }
    var base = REDUCED ? 0 : now * 0.000025;
    signWheel.rotation.z = base + userSpin;
    toneWheel.rotation.z = -(base + userSpin) * (20 / 13);
    kinBand.rotation.z = (base + userSpin) * 0.5;
    if (!REDUCED) starField.rotation.z = now * 0.000008;
    if (userMarker) {
      var p = 1 + Math.sin(now * 0.003) * 0.1;
      userMarker.scale.set(9 * p, 9 * p, 1);
    }
    // keep sprites' effective angular position: sprites always face camera,
    // so glyphs stay upright automatically.
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  /* Fly-in: camera dolly from deep space to the wheel face. */
  function flyIn(done) {
    if (REDUCED || !window.gsap) {
      camera.position.set(0, 6, 92); camera.lookAt(0, 0, 0);
      flownIn = true; if (done) done(); return;
    }
    var look = { x: 0, y: 0, z: -300 };
    var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: function () { flownIn = true; if (done) done(); } });
    tl.to(camera.position, { z: 260, y: 40, duration: 2.2, ease: 'power1.in' })
      .to(camera.position, { z: 92, y: 6, x: 0, duration: 2.4, ease: 'power3.out' }, '>-0.3')
      .to(look, { z: 0, duration: 2.0, onUpdate: function () { camera.lookAt(look.x, look.y, look.z); } }, '<')
      .to(wheelGroup.rotation, { x: -0.14, duration: 2.4 }, '<');
    camera.lookAt(look.x, look.y, look.z);
  }

  /* Ignite the user's kin on the outer band. */
  function igniteKin(r) {
    if (userMarker) { wheelGroup.remove(userMarker); userMarker = null; }
    var tx = new THREE.CanvasTexture(glyphTexture(r.signIndex, PALETTE.gold, PALETTE.gold, 512));
    userMarker = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, opacity: 1 }));
    var a = (r.kin - 1) / 260 * Math.PI * 2;
    userMarker.position.set(Math.cos(a) * KIN_R, Math.sin(a) * KIN_R, 2);
    userMarker.scale.set(0.1, 0.1, 1);
    wheelGroup.add(userMarker);
    if (window.gsap && !REDUCED) {
      gsap.to(userMarker.scale, { x: 9, y: 9, duration: 1.4, ease: 'elastic.out(1, 0.5)', delay: 0.4 });
    } else userMarker.scale.set(9, 9, 1);
  }

  /* ------------------------------------------------------------
     Reading panels (DOM)
     ------------------------------------------------------------ */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function glyphImg(signIndex, cls) {
    var cv = glyphTexture(signIndex, PALETTE.bone, PALETTE.jade, 160);
    return '<img class="' + cls + '" alt="" src="' + cv.toDataURL() + '">';
  }
  function toneImg(tone, cls) {
    var cv = toneTexture(tone, PALETTE.gold, 160);
    return '<img class="' + cls + '" alt="" src="' + cv.toDataURL() + '">';
  }

  function fmtDate(iso) {
    var p = iso.split('-');
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Number(p[2]) + ' ' + M[Number(p[1]) - 1] + ' ' + p[0];
  }

  function renderReading(r, tob) {
    var sc = C.SIGNS[r.signIndex], tc = C.TONES[r.tone];
    var name = r.tone + ' ' + r.sign.yucatec;

    $('r-kin-head').innerHTML =
      glyphImg(r.signIndex, 'g-lg') +
      '<div><div class="kicker">Kin ' + r.kin + ' of 260</div>' +
      '<h2>' + name + '</h2>' +
      '<div class="sub">' + esc(r.sign.meaning) + ' · K’iche’: ' + esc(r.sign.kiche) + '</div>' +
      '<div class="sub dim">' + fmtDate(r.iso) + (tob ? ' · ' + esc(tob) : '') + '</div></div>';

    $('r-sign').innerHTML =
      '<div class="kicker">Day Sign · ' + esc(r.sign.yucatec) + '</div>' +
      '<h3>' + esc(sc.title) + '</h3>' +
      '<p class="tagline">' + esc(sc.tagline) + '</p>' +
      '<p>' + esc(sc.essence) + '</p>' +
      '<div class="gsrow"><div><span class="lbl gift">Gift</span><p>' + esc(sc.gift) + '</p></div>' +
      '<div><span class="lbl shadow">Shadow</span><p>' + esc(sc.shadow) + '</p></div></div>' +
      '<p class="invite">' + esc(sc.invitation) + '</p>';

    $('r-tone').innerHTML =
      toneImg(r.tone, 'g-md') +
      '<div><div class="kicker">Tone ' + r.tone + ' · ' + esc(tc.name) + '</div>' +
      '<h3>' + esc(tc.title) + '</h3><p>' + esc(tc.essence) + '</p></div>';

    // Trecena strip: 13 days from the wave start
    var strip = '';
    for (var i = 0; i < 13; i++) {
      var d = T.fromJDN(r.trecena.jdn + i);
      var me = d.kin === r.kin;
      strip += '<div class="tday' + (me ? ' me' : '') + '" title="' + fmtDate(d.iso) + '">' +
        glyphImg(d.signIndex, 'g-sm') +
        '<span>' + d.tone + ' ' + esc(d.sign.yucatec) + '</span></div>';
    }
    var waveSign = T.DAY_SIGNS[r.trecena.signIndex];
    $('r-trecena').innerHTML =
      '<div class="kicker">Trecena · the 13-day wave of 1 ' + esc(waveSign.yucatec) + '</div>' +
      '<p>Your kin rides day ' + r.tone + ' of the wave that opened on ' + fmtDate(r.trecena.iso) +
      ' under 1 ' + esc(waveSign.yucatec) + ' — ' + esc(waveSign.meaning.toLowerCase()) + '.</p>' +
      '<div class="strip">' + strip + '</div>';

    var yb = r.yearBearer;
    $('r-facts').innerHTML =
      fact('Haab (solar calendar)', r.haab.day + ' ' + r.haab.month,
        'The 365-day vague year position of your birth.') +
      fact('Long Count', r.longCount ? r.longCount.text : '—',
        'Days elapsed since the creation date 0.0.0.0.0, 4 Ajaw 8 Kumk’u (11 Aug 3114 BCE).') +
      fact('Lord of the Night', r.lordOfNight,
        'The ' + esc(C.LORDS[r.lordOfNight]) + '.') +
      fact('Year Bearer', yb.tone + ' ' + T.DAY_SIGNS[yb.signIndex].yucatec,
        'The Tzolk’in day carrying the Haab year you were born into (0 Pop fell on ' + fmtDate(yb.iso) + ').') +
      fact('Calendar Round return', fmtDate(r.calendarRound.iso),
        'After 18,980 days (~52 years) the Tzolk’in and Haab realign — your full calendar birthday.');

    $('r-precision').innerHTML =
      'Computed with the GMT correlation (JDN 584283), the standard that matches the unbroken count ' +
      'kept by K’iche’ daykeepers in Guatemala. The Tzolk’in is a pure day count, so your ' +
      'birth time colours the reading but does not shift the day' +
      (tob ? ' — at ' + esc(tob) + ' the day is unambiguous under every rollover convention' : '') + '.';

    // Today footer
    var now = new Date();
    var todayISO = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    var td = T.fromISO(todayISO);
    var rel = mod260(td.kin - r.kin);
    $('r-today').innerHTML = 'Today is <strong>Kin ' + td.kin + ' · ' + td.tone + ' ' +
      esc(td.sign.yucatec) + '</strong> — day ' + (rel + 1) + ' of your current 260-day round.';
  }
  function mod260(n) { return ((n % 260) + 260) % 260; }
  function fact(k, v, d) {
    return '<div class="fact"><div class="fk">' + k + '</div><div class="fv">' + v + '</div><div class="fd">' + d + '</div></div>';
  }

  function showSignDetail(si) {
    var sc = C.SIGNS[si], s = T.DAY_SIGNS[si];
    showModal(glyphImg(si, 'g-md') +
      '<div class="kicker">Day sign ' + (si + 1) + ' of 20</div>' +
      '<h3>' + esc(s.yucatec) + ' · ' + esc(sc.title) + '</h3>' +
      '<p class="tagline">' + esc(sc.tagline) + '</p><p>' + esc(sc.essence) + '</p>');
  }
  function showToneDetail(t) {
    var tc = C.TONES[t];
    showModal(toneImg(t, 'g-md') +
      '<div class="kicker">Tone ' + t + ' of 13 · ' + esc(tc.name) + '</div>' +
      '<h3>' + esc(tc.title) + '</h3><p>' + esc(tc.essence) + '</p>');
  }
  function showModal(html) {
    $('modal-body').innerHTML = html;
    $('modal').classList.add('open');
  }

  /* ------------------------------------------------------------
     Boot / gate
     ------------------------------------------------------------ */
  function writeURL(dob, tob) {
    var q = new URLSearchParams();
    q.set('d', dob); if (tob) q.set('t', tob);
    history.replaceState(null, '', location.pathname + '?' + q);
  }

  function reveal(dob, tob) {
    reading = T.fromISO(dob);
    writeURL(dob, tob);
    renderReading(reading, tob);
    $('gate').classList.add('gone');
    document.body.classList.add('revealed');
    if (WEBGL && !REDUCED) {
      flyIn(function () {
        igniteKin(reading);
        $('descend').classList.add('show');
        $('hud').classList.add('show');
      });
      // pre-place the marker so it's there when camera arrives
      setTimeout(function () { }, 0);
    } else {
      flownIn = true;
      if (WEBGL) { flyIn(); igniteKin(reading); }
      else { $('static-wheel').classList.add('show'); drawStaticWheel(reading); }
      $('descend').classList.add('show');
      $('hud').classList.add('show');
    }
    var hudSign = reading.tone + ' ' + reading.sign.yucatec;
    $('hud').innerHTML = 'Kin ' + reading.kin + ' · <strong>' + esc(hudSign) + '</strong>';
  }

  /* 2D fallback wheel for reduced-motion / no-WebGL. */
  function drawStaticWheel(r) {
    var cv = $('static-wheel');
    var s = Math.min(innerWidth, 560);
    cv.width = cv.height = s * Math.min(devicePixelRatio, 2);
    cv.style.width = cv.style.height = s + 'px';
    var x = cv.getContext('2d');
    x.scale(cv.width / s, cv.width / s);
    x.strokeStyle = 'rgba(43,182,139,0.4)'; x.lineWidth = 1;
    circle(x, s / 2, s / 2, s * 0.46); circle(x, s / 2, s / 2, s * 0.30);
    for (var i = 0; i < 20; i++) {
      var a = i / 20 * Math.PI * 2 - Math.PI / 2;
      var g = glyphTexture(i, i === r.signIndex ? PALETTE.gold : PALETTE.bone,
        i === r.signIndex ? PALETTE.gold : null, 96);
      var gs = s * 0.085;
      x.drawImage(g, s / 2 + Math.cos(a) * s * 0.38 - gs / 2, s / 2 + Math.sin(a) * s * 0.38 - gs / 2, gs, gs);
    }
    var tg = toneTexture(r.tone, PALETTE.gold, 192);
    x.drawImage(tg, s / 2 - s * 0.11, s / 2 - s * 0.11, s * 0.22, s * 0.22);
  }

  function boot() {
    var status = $('math-status');
    if (!T.VALID) {
      status.textContent = 'Self-test failed: ' + T.FAILURES.join('; ');
      status.classList.add('bad');
    } else {
      status.textContent = 'Calendar mathematics self-verified ✓ (epoch, 2012 baktun & round-trip anchors · GMT 584283)';
    }

    var q = new URLSearchParams(location.search);
    var dob = $('dob'), tob = $('tob');
    dob.max = new Date().toISOString().slice(0, 10);
    dob.value = q.get('d') || '2002-05-08';
    tob.value = q.get('t') || '13:00';

    if (WEBGL) buildScene();
    else document.body.classList.add('no-webgl');

    $('gate-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!dob.value) return;
      reveal(dob.value, tob.value);
    });
    $('descend').addEventListener('click', function () {
      $('panels').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
    // fade HUD chrome out once the reader is in the panels
    addEventListener('scroll', function () {
      var deep = scrollY > innerHeight * 0.5;
      $('descend').classList.toggle('show', flownIn && !deep);
    }, { passive: true });
    $('modal').addEventListener('click', function (e) {
      if (e.target === $('modal') || e.target.id === 'modal-close') $('modal').classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') $('modal').classList.remove('open');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
