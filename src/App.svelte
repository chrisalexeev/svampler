<script lang="ts">
  import Sampler from "./lib/components/Sampler.svelte";
  let init = false;
</script>

<main>
  {#if !init}
    <div id="forward">
      <h1>Svampler 🥁</h1>
      <p>
        This started as a way to learn the Web Audio API, Svelte, Rust, and WASM
        (at the moment there is no Rust or WASM in the main branch).
      </p>
      <p>
        Currently, I am in the process of redesigning this as a full
        application, <em>not just a toy</em>. The <code>sampler.ts</code> implementation will be
        broken out to be a full, modular, audio routing engine, of which the
        drum machine will be a single module. Upcoming improvements include
        synthesizers, effect racks, a mix bus, arranger, and more.
      </p>
      <p>
        The long-term goal of this app is to be an in-browser production studio,
        tailored to my personal workflow, that can handle additional DSP via
        Rust+WASM to create
      </p>
      <p class="bangers">
        🔥 <em>~certified bangers~</em> 🔥.
      </p>
    </div>
    <button
      on:click={() => {
        init = true;
      }}>Let's go!</button
    >
  {:else}
    <Sampler />
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
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

  #forward {
    max-width: 50%;
  }

  #forward h1 {
    font-size: 3rem;
    text-align: center;
  }

  #forward .bangers {
    text-align: center;
  }

  code {
    background-color: hsl(0, 0%, 20%);
    border-radius: 0.25rem;
  }
</style>
