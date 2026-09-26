/* Twinkling starfield with the occasional shooting star. */
(function () {
  "use strict";
  const canvas = document.getElementById("stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const count = Math.round((w * h) / 1500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() < 0.04 ? 0.9 + Math.random() * 0.6 : 0.3 + Math.random() * 0.55,
      a: 0.18 + Math.random() * 0.45,
      s: 0.4 + Math.random() * 1.6,
      p: Math.random() * Math.PI * 2,
      warm: Math.random() < 0.12,
    }));
    if (reduce) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t / 1000 * s.s + s.p);
      ctx.globalAlpha = s.a * tw;
      ctx.fillStyle = s.warm ? "#f6e6ff" : "#e4d8f6";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.2) {
        ctx.globalAlpha = s.a * tw * 0.25;
        ctx.fillRect(s.x - s.r * 3, s.y - 0.25, s.r * 6, 0.5);
        ctx.fillRect(s.x - 0.25, s.y - s.r * 3, 0.5, s.r * 6);
      }
    }
    if (!reduce) {
      if (!shooting && t > nextShoot) {
        shooting = { x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, vx: -(3 + Math.random() * 3), vy: 1.4 + Math.random() * 1.5, life: 0 };
      }
      if (shooting) {
        const s = shooting;
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        const alpha = Math.max(0, 1 - s.life / 60);
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14);
        ctx.stroke();
        if (s.life > 60) {
          shooting = null;
          nextShoot = t + 7000 + Math.random() * 12000;
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
  nextShoot = 4000;
  if (!reduce) requestAnimationFrame(loop);
})();
