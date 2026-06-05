// Canvas mount: sizing, DPR handling, and the requestAnimationFrame loop.
// The render callback receives a logical (CSS-pixel) coordinate system —
// DPR scaling is applied via setTransform so callers don't need to think about it.

export function mountStage(canvas, render) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let last = performance.now();

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now) {
    const dt = Math.min(50, now - last);
    last = now;
    render({ ctx, width, height, dt });
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(frame);

  return function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}
