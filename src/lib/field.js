// The particle field — state, brownian step, and render pass.
//
// The visual is composed of soft radial-gradient circles drawn with
// `globalCompositeOperation = 'multiply'` over a white background, so
// each particle reads as a translucent tinted lens stacked on the slide.
//
// Default home for new visual behaviors. Only split out a new module
// once two distinct behaviors share non-trivial logic.

import { palette } from './palette.js';

const COUNT = 500;
const MIN_R = 8;
const MAX_R = 36;
const BROWNIAN = 0.12;     // per-axis velocity jitter per frame
const DAMPING = 0.94;      // velocity decay
const POINTER_PULL = 0.0009;
const POINTER_RADIUS = 260;

function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export function createField(width, height) {
  const particles = new Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const spectral = Math.random() < palette.spectralRatio;
    particles[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: MIN_R + Math.random() * (MAX_R - MIN_R),
      color: spectral ? pick(palette.spectral) : pick(palette.cell),
      spectral,
    };
  }
  return { particles };
}

export function stepField(field, dt, pointer, width, height) {
  const pressed = pointer.pressed ? 3 : 1;
  const active = pointer.active;
  for (let i = 0; i < field.particles.length; i++) {
    const p = field.particles[i];

    // Brownian jitter
    p.vx += (Math.random() - 0.5) * BROWNIAN;
    p.vy += (Math.random() - 0.5) * BROWNIAN;

    // Pointer influence: pull within a soft radius
    if (active) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < POINTER_RADIUS * POINTER_RADIUS) {
        const falloff = 1 - Math.sqrt(d2) / POINTER_RADIUS;
        const pull = POINTER_PULL * pressed * falloff;
        p.vx += dx * pull;
        p.vy += dy * pull;
      }
    }

    p.vx *= DAMPING;
    p.vy *= DAMPING;

    p.x += p.vx;
    p.y += p.vy;

    // Wrap edges so the field never feels bounded
    if (p.x < -p.r) p.x = width + p.r;
    else if (p.x > width + p.r) p.x = -p.r;
    if (p.y < -p.r) p.y = height + p.r;
    else if (p.y > height + p.r) p.y = -p.r;
  }
}

export function drawField(ctx, field, width, height) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < field.particles.length; i++) {
    const p = field.particles[i];
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
}
