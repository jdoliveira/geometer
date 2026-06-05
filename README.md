# Geometer

An animated geometric visualizer — a single evolving piece. Drifting fields of cells, bubbles, grains, and crystal fragments under a backlit-microscope palette: mostly white, with desaturated accents and occasional pops of spectral hue.

Move the cursor across the canvas to influence the field. The piece keeps evolving on its own when you let go.

## Live

Once GitHub Pages is enabled for the repo: `https://<your-username>.github.io/geometer/`

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview   # serve the production build at http://localhost:4173
```

## Stack

- [Svelte 5](https://svelte.dev) — UI shell
- [Vite](https://vitejs.dev) — dev server and bundler
- HTML5 Canvas 2D — the visual surface

## Aesthetic

Geometer is meant to feel organic and microscopic — like watching gelatinous cells, sand grains, and crystal fragments drift across a backlit slide. White is the baseline; color is restrained; saturated spectral hues are *pops*, not the substrate. Motion should read as brownian and unresolved, never as UI easing.

Colors live in [`src/lib/palette.js`](./src/lib/palette.js); motion and rendering live in [`src/lib/field.js`](./src/lib/field.js).

## Deploy

Pushing to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which builds and publishes `dist/` to GitHub Pages. Enable Pages in **Settings → Pages → Source: GitHub Actions** on first setup.

The Vite `base` is set to `/geometer/` in [`vite.config.js`](./vite.config.js) — change it if the repo is renamed.

## License

MIT
