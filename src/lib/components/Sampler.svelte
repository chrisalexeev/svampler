<script lang="ts">
    import { onMount } from "svelte";
    import { sampler } from "../sampler";
    import Dragable from "./shared/Dragable.svelte";
    import Library from "./Library.svelte";
    import Sequencer from "./Sequencer.svelte";
    import Pads from "./Pads.svelte";
    import Mixer from "./Mixer.svelte";
    import Eight08 from "./Eight08.svelte";
    import { synth } from "../sampler/sampler";

    const ctx = new AudioContext();

    onMount(() => {
        sampler.init(ctx);
        synth.init(ctx);
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
    <div id="eight08-container">
        <Eight08 />
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
