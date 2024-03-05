<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { sampler } from "../sampler";
    import Dragable from "./shared/Dragable.svelte";
    import Library from "./Library.svelte";
    import Sequencer from "./Sequencer.svelte";
    import Pads from "./Pads.svelte";
    import Mixer from "./Mixer.svelte";

    onMount(() => {
        sampler.init();
    });

    onDestroy(() => {
        sampler.destroy();
    });
</script>

<div id="sampler">
    <div id="pads-container">
        <Dragable>
            <Pads />
        </Dragable>
    </div>
    <div id="sequencer-container">
        <Sequencer />
    </div>
    <div id="library-container">
        <Library />
    </div>
    <div id="mixer-container">
        <Mixer />
    </div>
</div>

<style>
    #sampler {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(2, fit-content(50%));
        grid-template-areas:
            "library pads mixer"
            "library sequencer sequencer";
    }
    #pads-container {
        grid-area: pads;
    }
    #sequencer-container {
        grid-area: sequencer;
    }
    #library-container {
        grid-area: library;
        height: 100%;
        overflow-y: auto;
    }
    #mixer-container {
        grid-area: mixer;
    }
</style>
