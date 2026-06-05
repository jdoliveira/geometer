// All colors live here. Touch this before touching field render code.
//
// Body colors are desaturated tints designed to read against a white
// background under `globalCompositeOperation = 'multiply'`. Spectral
// colors are pops, used sparingly on a small fraction of particles.

export const palette = {
  background: '#ffffff',

  cell: [
    'rgba(180, 210, 215, 0.55)', // pale teal
    'rgba(220, 200, 200, 0.55)', // pale rose
    'rgba(225, 215, 190, 0.55)', // pale ochre
    'rgba(200, 195, 215, 0.55)', // pale violet
    'rgba(195, 215, 195, 0.50)', // pale celadon
    'rgba(210, 205, 220, 0.50)', // pale lilac
  ],

  spectral: [
    'rgba(255, 110, 90, 0.65)',  // coral
    'rgba(255, 200, 60, 0.65)',  // amber
    'rgba(80, 200, 230, 0.70)',  // cyan
    'rgba(190, 100, 220, 0.65)', // magenta-violet
    'rgba(120, 220, 140, 0.65)', // chartreuse
  ],

  // Fraction of particles that carry a spectral hue.
  spectralRatio: 0.025,
};
