<script lang="ts">
  import { requestFrame } from "../requestFrame";

  import { afterUpdate, onMount } from "svelte";

  import { Scene } from "../Scene";

  export let m: number;
  export let n: number;
  export let height: number = 400;
  export let width: number = 400;
  export let bluntness: number = 0.2;
  let canvas: HTMLCanvasElement;

  let scene: Scene;

  $: {
    if (scene) {
      scene.m = m;
      scene.n = n;
      scene.distanceFromCircumference = bluntness;
    }
  }

  onMount(() => {
    scene = new Scene({
      m,
      n,
      canvas,
      distanceFromCircumference: bluntness,
      height,
      width,
      showSmallCircleCircumference: false,
    });
    const { start } = requestFrame(() => {
      scene.roll(0.01);
      scene.rotate(0.005);
      scene.draw();
    }, 15);

    start();
  });
</script>

<div class="canvas-container">
  <canvas id="canvas" bind:this={canvas} />
</div>

<style>
  #canvas {
    max-width: 100vw;
    max-height: 100vw;
  }

  .canvas-container {
    width: 100vw;
    display: flex;
    justify-content: center;
  }
</style>
