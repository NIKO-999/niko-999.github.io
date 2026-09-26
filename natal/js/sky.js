/* Starfield: realistic star colours, irregular scintillation, glowing bright stars with pulsing spikes, the odd shooting star. */
(function () {
  "use strict";
  const canvas = document.getElementById("stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // stellar colours by temperature, weighted toward white
  const COLOURS = [
    [[155, 176, 255], 0.1], [[202, 215, 255], 0.22], [[248, 247, 255], 0.38], [[255, 244, 234], 0.18], [[255, 210, 161], 0.09], [[255, 180, 130], 0.03],
  ];
  const pickColour = () => {
    let r = Math.random();
    for (const [c, wt] of COLOURS) { if ((r -= wt) <= 0) return c; }
    return COLOURS[2][0];
  };
  let stars = [], w = 0, h = 0, dpr = 1, shooting = null, nextShoot = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 1300);
    stars = Array.from({ length: count }, () => {
      const bright = Math.random() < 0.022;
      return {
        x: Math.random() * w,
        // thinner toward the glowing horizon
        y: Math.pow(Math.random(), 1.35) * h * 0.8,
        r: bright ? 0.95 + Math.random() * 0.75 : 0.25 + Math.pow(Math.random(), 2) * 0.7,
        a: bright ? 0.75 + Math.random() * 0.25 : 0.2 + Math.random() * 0.55,
        s1: 1.2 + Math.random() * 3.2, // twinkle speeds (rad/s)
        s2: 3.5 + Math.random() * 6,
        p1: Math.random() * Math.PI * 2,
        p2: Math.random() * Math.PI * 2,
        depth: 0.45 + Math.random() * 0.5, // how strongly it twinkles
        c: pickColour(),
        bright,
      };
    });
    if (reduce) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const ts = t / 1000;
    for (const s of stars) {
      // two incommensurate frequencies give an irregular, atmospheric flicker
      const flick = reduce ? 1 : 1 - s.depth * (0.5 - 0.5 * Math.sin(ts * s.s1 + s.p1)) * (0.6 + 0.4 * Math.sin(ts * s.s2 + s.p2));
      const alpha = s.a * flick;
      // slight colour scintillation
      const shift = reduce ? 0 : Math.sin(ts * s.s2 * 0.7 + s.p1) * 18;
      const r = Math.min(255, s.c[0] + shift), g = s.c[1], b = Math.min(255, s.c[2] - shift);
      const rgb = `${r | 0},${g | 0},${b | 0}`;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${rgb})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (0.85 + 0.15 * flick), 0, Math.PI * 2);
      ctx.fill();
      if (s.bright) {
        // soft glow
        const gr = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        gr.addColorStop(0, `rgba(${rgb},${0.35 * flick})`);
        gr.addColorStop(1, `rgba(${rgb},0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = gr;
        ctx.fillRect(s.x - s.r * 6, s.y - s.r * 6, s.r * 12, s.r * 12);
        // diffraction spikes that pulse with the twinkle
        const len = s.r * (2.5 + 4 * flick);
        ctx.globalAlpha = 0.3 * alpha;
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.fillRect(s.x - len, s.y - 0.2, len * 2, 0.4);
        ctx.fillRect(s.x - 0.2, s.y - len, 0.4, len * 2);
      }
    }
    if (!reduce) {
      if (!shooting && t > nextShoot) {
        shooting = { x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.35, vx: -(3 + Math.random() * 3), vy: 1.4 + Math.random() * 1.5, life: 0 };
      }
      if (shooting) {
        const s = shooting;
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        const alpha = Math.max(0, 1 - s.life / 55);
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 16, s.y - s.vy * 16);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 16, s.y - s.vy * 16);
        ctx.stroke();
        if (s.life > 55) {
          shooting = null;
          nextShoot = t + 8000 + Math.random() * 14000;
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();
  nextShoot = 5000;
  if (!reduce) requestAnimationFrame(loop);
})();
