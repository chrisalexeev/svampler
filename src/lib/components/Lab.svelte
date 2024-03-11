<script lang="ts">
    import { onMount } from "svelte";
    import { mixBus } from "../lab";
    import Dragable from "./shared/Dragable.svelte";
    import { Eight08 as Eight08Inst } from "../lab/instruments/eight08";
    import Eight08 from "./instruments/Eight08.svelte";

    const ctx = new AudioContext();
    const eight08 = new Eight08Inst(ctx);

    onMount(() => {
        mixBus.init(ctx);
        mixBus.connectToTrack(eight08, 0);
    });
</script>

<div id="sampler">
    <Dragable>
        <Eight08 {eight08} />
    </Dragable>
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
