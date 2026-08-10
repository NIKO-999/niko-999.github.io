/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — AMBIENT PARTICLE DRIFT
 * ═══════════════════════════════════════════════════════════════════════════
 *  A sparse field of dim, slowly drifting dots behind the mandala — purely
 *  decorative, no dependency on profile state. This is deliberately NOT
 *  built the way the original rim rotation was: nothing here is a filtered
 *  SVG element being transformed every frame (that combination — feGaussian
 *  Blur + continuous transform — is what forced a full re-rasterise per
 *  frame and caused the original mobile lag). This is plain canvas circles,
 *  position-only, capped at 30fps, with a low fixed particle count and no
 *  filters at all.
 *
 *  Respects prefers-reduced-motion (skips the loop, canvas stays blank) and
 *  pauses on tab-hide via visibilitychange.
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => innerWidth <= 899;
  let W = 0, H = 0, DPR = 1;
  let particles = [];

  function makeParticles() {
    const count = Math.min(isMobile() ? 26 : 46, Math.round((W * H) / 26000));
    particles = Array.from({ length: Math.max(count, 14) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.10,
      vy: (Math.random() - 0.5) * 0.10,
      r: 0.6 + Math.random() * 1.3,
      base: 0.10 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function resize() {
    W = innerWidth; H = innerHeight;
    DPR = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    makeParticles();
  }
  resize();
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  const FRAME_MS = 1000 / 30;
  let last = 0;
  function loop(now) {
    if (!running) return;
    requestAnimationFrame(loop);
    if (now - last < FRAME_MS) return;
    const dt = now - last;
    last = now;

    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      if (p.x < -4) p.x = W + 4; else if (p.x > W + 4) p.x = -4;
      if (p.y < -4) p.y = H + 4; else if (p.y > H + 4) p.y = -4;
      const a = p.base * (0.55 + 0.45 * Math.sin(now / 2200 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(207,239,255,' + a.toFixed(3) + ')';
      ctx.fill();
    });
  }
  requestAnimationFrame(loop);
})();
