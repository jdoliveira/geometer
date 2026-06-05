// Pointer state: position (CSS pixels relative to target), velocity,
// pressed, and `active` (true while the cursor is over the target).

export function createPointer(target) {
  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
    pressed: false,
  };
  let last = { x: 0, y: 0, t: performance.now() };

  function update(e) {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const dt = Math.max(1, now - last.t);
    state.vx = (x - last.x) / dt;
    state.vy = (y - last.y) / dt;
    state.x = x;
    state.y = y;
    state.active = true;
    last = { x, y, t: now };
  }

  function enter(e) {
    state.active = true;
    update(e);
  }

  function leave() {
    state.active = false;
    state.pressed = false;
    state.vx = 0;
    state.vy = 0;
  }

  function down() {
    state.pressed = true;
  }

  function up() {
    state.pressed = false;
  }

  target.addEventListener('pointermove', update);
  target.addEventListener('pointerenter', enter);
  target.addEventListener('pointerleave', leave);
  target.addEventListener('pointerdown', down);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', leave);

  return {
    state,
    destroy() {
      target.removeEventListener('pointermove', update);
      target.removeEventListener('pointerenter', enter);
      target.removeEventListener('pointerleave', leave);
      target.removeEventListener('pointerdown', down);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', leave);
    },
  };
}
