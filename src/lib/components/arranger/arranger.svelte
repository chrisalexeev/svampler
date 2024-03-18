<script lang="ts">
    import { eventProcessor } from "$lib/lab";
    import { Arrangement as Arrangement_ } from "$lib/lab/arranger";
    import { arranger } from "$lib/lab/arranger";
    import { invoker } from "$lib/lab/commands";
    import { AddArrangementCommand } from "$lib/lab/commands/arranger";
    import { onMount } from "svelte";
    import Arrangement from "./arrangement.svelte";
    import { REFRESH_ARRANGER } from "$lib/constants/topics";
    import Panel from "../shared/Panel.svelte";
    import ArrangementMenu from "./arrangementMenu.svelte";

    let arrangements = arranger.arrangements;

    function addArrangement() {
        const arr = new Arrangement_();
        const command = new AddArrangementCommand(arranger, arr);
        invoker.execute(command);
    }

    function handleUpdateArrangements() {
        arrangements = arranger.arrangements;
    }

    function handlePlay() {
        arranger.play();
    }

    function handleStop() {
        arranger.stop();
    }

    onMount(() => {
        eventProcessor.subscribe(REFRESH_ARRANGER, handleUpdateArrangements);
        return () => {
            eventProcessor.unsubscribe(REFRESH_ARRANGER, handleUpdateArrangements);
        };
    });
</script>

<div class="arranger">
    <button on:click={addArrangement}>Add Arrangement</button>
    <button on:click={handlePlay}>Play</button>
    <button on:click={handleStop}>Stop</button>
    {#each arrangements as arrangement}
    <Panel menuComponent={ArrangementMenu} menuOptions={{arrangement}}>
        <Arrangement {arrangement} />
    </Panel>
    {/each}
</div>
