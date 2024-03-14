<script lang="ts">
    import { onMount } from "svelte";
    import { mixBus, library, Sampler, eventProcessor } from "$lab";
    import Dragable from "$lib/components/shared/Dragable.svelte";
    import Library from "./Library.svelte";
    import Sequencer from "./Sequencer.svelte";
    import Pads from "./Pads.svelte";
    import Mixer from "./Mixer.svelte";

    const ctx = new AudioContext();
    const sampler = new Sampler(eventProcessor, library);

    onMount(() => {
        sampler.init(ctx);
        mixBus.init(ctx);
        sampler.connect(mixBus.tracks[0].input);
    });
</script>

<div id="sampler">
    <div id="pads-container">
        <Dragable>
            <Pads {sampler} />
        </Dragable>
    </div>
    <div id="sequencer-container">
        <Sequencer {sampler} />
    </div>
    <div id="library-container">
        <Library {sampler} />
    </div>
    <div id="mixer-container">
        <Mixer {sampler} />
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
            "library pads mixer eight08"
            "library sequencer sequencer sequencer";
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
    #eight08-container {
        grid-area: eight08;
    }
</style>
