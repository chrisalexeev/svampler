<script lang="ts">
  import Sampler from "./lib/components/Sampler.svelte";
  // import * as wasm from "wasm-int";
  // wasm.greet();
  let isInitialized = false;
</script>

<main>
  {#if !isInitialized}
    <button
      on:click={() => {
        isInitialized = true;
      }}>Let's go!</button
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
    overflow: hidden;
    -ms-overflow-style: none; /* hide scrollbar in IE and Edge */
    scrollbar-width: none; /* hide scrollbar in Firefox */
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  main::-webkit-scrollbar {
    display: none;
  }
</style>
