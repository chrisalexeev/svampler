<script lang="ts">
    import { onMount } from "svelte";
    import { mixBus, eventProcessor } from "../lab";
    import { keyMap } from "../lab/instruments";
    import Dragable from "./shared/Dragable.svelte";
    import { MonoOsc as Eight08Inst } from "../lab/instruments/eight08";
    import Eight08 from "./instruments/MonoOsc.svelte";
    import Mixer from "./mixBus/Mixer.svelte";
    import Loading from "./Loading.svelte";
    import { NOTE_DOWN, NOTE_UP, OCTAVE_CHANGE } from "$lib/constants/topics";

    const ctx = new AudioContext();
    const eight08 = new Eight08Inst(ctx);
    let initialized = false;

    function handleKeydown(e: KeyboardEvent) {
        // TODO: refactor to use a map or smth later
        switch (e.key) {
            case "z":
                eventProcessor.dispatchEvent(OCTAVE_CHANGE, -1);
                break;
            case "x":
                eventProcessor.dispatchEvent(OCTAVE_CHANGE, 1);
                break;
            default:
                if (keyMap[e.key] === undefined) return;
                eventProcessor.dispatchEvent(NOTE_DOWN, keyMap[e.key]);
        }
    }

    function handleKeyup(e: KeyboardEvent) {
        // TODO: same here
        switch (e.key) {
            case "z":
                break;
            case "x":
                break;
            default:
                if (keyMap[e.key] === undefined) return;
                eventProcessor.dispatchEvent(NOTE_UP, keyMap[e.key]);
        }
    }

    onMount(() => {
        mixBus.init(ctx);
        mixBus.connectToTrack(eight08, 0);
        window.addEventListener("keypress", handleKeydown);
        window.addEventListener("keyup", handleKeyup);
        initialized = true;
        return () => {
            window.removeEventListener("keypress", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        };
    });
</script>

<div id="sampler">
    <!-- <Dragable> -->
    {#if initialized}
        <Mixer />
        <Eight08 monoOsc={eight08} />
    {:else}
        <Loading />
    {/if}
    <!-- </Dragable> -->
</div>

<style>
    #sampler {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /* display: grid;
        gap: 20px;
        grid-template-columns: repeat(2, fit-content(50%));
        grid-template-areas:
            "library pads mixer eight08"
            "library sequencer sequencer sequencer"; */
    }
    /* #pads-container {
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
    } */
</style>
