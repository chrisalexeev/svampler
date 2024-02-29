<script lang="ts">
  import { sampler } from "./lib/sampler/sampler";
  import { eventProcessor } from "./lib/sampler/sampler";
    import Sampler from "./lib/components/Sampler.svelte";
  let init = false;
</script>

<main>
  {#if !init}
    <button
      on:click={() => {init = true}}>Let's go!</button
    >
  {:else}
    <Sampler />
  {/if}
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: hsl(0, 0%, 10%);
    color: white;
  }
</style>
