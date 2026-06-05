# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project intent

Geometer is a single evolving visual piece — not a gallery, not a toolkit, not a controls demo. The user's own description of the aesthetic, kept verbatim so it doesn't get paraphrased away:

> organic fields; like pools of cells, round, spherical, bubbles, grains, dirt, crystals — microscopic brownian motion with the color palette of a backlit microscope slide looking through gelatinous amoeba, sand particles, crystal fragments; but with an underlying logic. mostly white, with accent colors in a generally desaturated palette with some pops of spectral densely changing hues.

The piece evolves on its own; pointer input strongly influences the field but does **not** literally draw.

## Aesthetic guardrails

These bind harder than code conventions — violating them is worse than untidy code.

- **Background is white.** Not off-white, not cream, no dark mode. The composition reads against light.
- **Body colors are desaturated.** Pale teal, pale rose, pale ochre, etc. All color choices live in `src/lib/palette.js` — edit there, not inline in render code.
- **Spectral hues are pops, not the baseline.** Use them on a small fraction of particles or in rare moments. Never as the dominant color.
- **Motion is brownian.** Random walks, soft accumulation, gentle damping. No `ease-in-out`, no linear sweeps, no UI-like transitions.
- **Pointer influence is not drawing.** The cursor pulls/pushes the field; it never leaves marks. Releasing returns the field to autonomous behavior.

## Rendering decision

**Canvas 2D is the chosen surface.** SVG was considered and rejected — the aesthetic requires thousands of soft, blended primitives, which SVG cannot render at frame rate.

Compositing uses `globalCompositeOperation = 'multiply'` against a white background to produce the gelatinous backlit-slide look (radial-gradient circles whose tinted center darkens the background while the alpha-zero edge leaves it untouched).

Do **not** drift back to SVG by reflex, and do **not** preemptively port to WebGL. WebGL is reserved for a deliberate later upgrade *only if* shader-based effects (true metaballs, gaussian blur, etc.) become necessary. Don't mix surfaces casually.

## Module map

| File | Responsibility |
|---|---|
| `src/main.js` | Svelte 5 mount point. |
| `src/App.svelte` | Root component; owns the `<canvas>` and wires stage + field + pointer together. |
| `src/app.css` | Page reset, full-bleed canvas, palette CSS custom properties. |
| `src/lib/stage.js` | Canvas sizing, DPR handling, `requestAnimationFrame` loop. |
| `src/lib/field.js` | Particle state, brownian step, render pass. **Default home for new visual behavior.** |
| `src/lib/interaction.js` | Pointer state (position, velocity, `pressed`, `active`). |
| `src/lib/palette.js` | All colors and the spectral-particle ratio. |

When adding a new visual behavior, the default home is `src/lib/field.js`. Only split out a new module once two distinct behaviors share non-trivial logic.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the built dist/
```

No tests, lints, or formatters by design — see *Out of scope*.

## Verifying changes

There is no test suite. Verify by running `npm run dev` and watching the canvas:

1. **Idle motion** — particles drift, no large jumps, no visible UI easing.
2. **Pointer interaction** — moving the cursor visibly influences nearby particles; pressing intensifies it; releasing returns the field to autonomous drift.
3. **Retina check** — open on a high-DPR display (or DevTools device emulation). Particles must stay crisp, not blurry. DPR handling lives in `stage.js` and regressions there are easy to miss.
4. **Resize** — drag the window. The canvas should re-fit without flicker or aspect distortion.

Do not claim a visual change "works" without opening the browser. Type-checks and builds are not enough here.

## Out of scope (deliberately)

These are **not** TODOs. Do not add them unprompted:

- Audio / Web Audio API — the piece is purely visual.
- Multiple scenes, sketches, or routes — Geometer is one evolving piece.
- A controls panel or parameter UI — parameters live in code; tuning happens by editing constants in `field.js` and `palette.js`.
- Unit tests or visual-regression tests — verification is by eye.
- Frameworks beyond Svelte + Vite (no SvelteKit, no state libraries, no UI kits).
- Dark mode.
