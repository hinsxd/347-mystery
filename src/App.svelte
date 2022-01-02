<script lang="ts">
  import Canvas from "./lib/Canvas.svelte";
  let m: number = 7;
  let n: number = 3;
  let bluntness: number = 0.2;
  $: document.title = `${m} / ${n} Star`;

  const handleIncM = () => {
    m++;
  };
  const handleIncN = () => {
    if (n < m - 1) n++;
  };
  const handleDecM = () => {
    if (m > 2 && m > n + 1) m--;
  };
  const handleDecN = () => {
    if (n > 2) n--;
  };
</script>

<div>
  <div class="data">
    <div class="data-row">
      <span class="label">m: </span>
      <button class="btn" on:click={handleDecM}>-</button>
      {m}
      <button class="btn" on:click={handleIncM}>+</button>
    </div>
    <div class="data-row">
      <span class="label">n: </span>
      <button class="btn" on:click={handleDecN}>-</button>
      {n}
      <button class="btn" on:click={handleIncN}>+</button>
    </div>
    <div class="data-row">
      <span class="label">Bluntness: </span>
      <input type="range" min={0} max={1} step={0.01} bind:value={bluntness} />
      {bluntness}
    </div>
  </div>
  <Canvas {m} {n}{bluntness} />
</div>

<style>
</style>
