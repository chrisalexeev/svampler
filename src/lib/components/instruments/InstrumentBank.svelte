<script lang="ts">
    import { eventProcessor, instrumentBank, mixBus } from "$lab";
    import { REFRESH_BANK } from "$lib/constants/topics";
    import { invoker } from "$lib/lab/commands";
    import { AddInstrumentCommand } from "$lib/lab/commands/instruments/addInstrument";
    import { MonoOsc as MonoOscInst } from "$lib/lab/instruments";
    import MonoOsc from "./MonoOsc.svelte";
    import { onMount } from "svelte";

    const componentMap: Record<string, any> = {
        "MonoOsc": MonoOsc,
    }

    let instruments = instrumentBank.getInstruments();

    function handleInstrumentBankRefresh() {
        instruments = instrumentBank.getInstruments();
    }

    function addInstrument() {
        const cmd = new AddInstrumentCommand(instrumentBank, MonoOscInst);
        invoker.execute(cmd);
    }

    onMount(() => {
        eventProcessor.subscribe(REFRESH_BANK, handleInstrumentBankRefresh);
        return () => {
            eventProcessor.unsubscribe(REFRESH_BANK, handleInstrumentBankRefresh);
        };
    });
</script>

<div class="container">
    <div>
        <button on:click={() => addInstrument()}>Add Instrument</button>
    </div>
    <div id="instruments">
        {#each instruments as instrument, i}
            <svelte:component this={componentMap[instrument.constructor.name]} {instrument} />
        {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }
    #instruments {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    h3 {
        margin: 0;
    }
</style>