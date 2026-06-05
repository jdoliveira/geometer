<script>
  import { onMount } from 'svelte';
  import { mountStage } from './lib/stage.js';
  import { createPointer } from './lib/interaction.js';
  import { createField, stepField, drawField } from './lib/field.js';

  let canvas;

  onMount(() => {
    const pointer = createPointer(canvas);
    let field = null;
    let lastW = 0;
    let lastH = 0;

    const stopStage = mountStage(canvas, ({ ctx, width, height, dt }) => {
      if (!field || width !== lastW || height !== lastH) {
        field = createField(width, height);
        lastW = width;
        lastH = height;
      }
      stepField(field, dt, pointer.state, width, height);
      drawField(ctx, field, width, height);
    });

    return () => {
      stopStage();
      pointer.destroy();
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
