<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { sampler } from "./lib/sampler/vtsampler";
  import Sequencer from "./lib/components/Sequencer.svelte";
  import { eventProcessor } from "./lib/store";
  import Pads from "./lib/components/Pads.svelte";
  import Dragable from "./lib/components/Dragable.svelte";
  let init = false;
  const pads = [
    { key: "a", sound: "kick" },
    { key: "s", sound: "snare" },
    { key: "d", sound: "hihat" },
  ];
  const handleKeyDown = (e: KeyboardEvent) => {
    const pad = pads.find((pad) => pad.key === e.key);
    if (pad) {
      eventProcessor.dispatchEvent(pad.sound);
    }
  };
  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
</script>

<main>
  {#if !init}
    <button
      on:click={() => {
        sampler.init(eventProcessor).then(() => {
          init = true;
        });
      }}>Let's go!</button
    >
  {:else}
    <div id="sampler">
      <Dragable>
        <Pads {pads} />
      </Dragable>
      <!-- <Dragable> -->
        <Sequencer />
      <!-- </Dragable> -->
    </div>
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
  #sampler {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
