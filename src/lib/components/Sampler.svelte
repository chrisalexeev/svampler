<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { eventProcessor, sampler } from "../sampler";
    import Dragable from "./shared/Dragable.svelte";
    import Library from "./Library.svelte";
    import Sequencer from "./Sequencer.svelte";
    import Pads from "./Pads.svelte";
    const pads = [
        { key: "a", sound: "kick" },
        { key: "s", sound: "snare" },
        { key: "d", sound: "hihat" },
    ];
    const handleKeyDown = (e: KeyboardEvent) => {
        const pad = pads.find((pad) => pad.key === e.key);
        if (pad) eventProcessor.dispatchEvent(pad.sound);
    };
    onMount(() => {
        sampler.init();
        window.addEventListener("keydown", handleKeyDown);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", handleKeyDown);
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
</div>

<style>
    #sampler {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(2, fit-content(50%));
        grid-template-areas:
            "library pads"
            "library sequencer";
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
</style>
