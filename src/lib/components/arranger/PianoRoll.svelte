<script lang="ts">
  let canvas: HTMLCanvasElement = new HTMLCanvasElement();
  let ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D();
  let notes = [];
  let subdivision = 8;
</script>

<div class="piano-roll">
  <canvas bind:this={canvas} />
</div>

<style>
  .piano-roll {
    width: 100%;
    height: 100%;
    background-color: #333;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style>
