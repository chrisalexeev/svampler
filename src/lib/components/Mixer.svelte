<script lang="ts">
    import { Sampler, keyMap } from "../lab";
    import MixerSlot from "./MixerSlot.svelte";
    import Dragable from "./shared/Dragable.svelte";
    export let sampler: Sampler;

    let handle: HTMLDivElement;
    let antiHandles = new Array(sampler.maxSamples).fill(null);
</script>

<Dragable handles={[handle]} {antiHandles}>
    <div id="mixer" bind:this={handle}>
        {#each { length: sampler.maxSamples } as _, i}
            <!-- Svelte is fxcking awesome -->
            <div class="mixer-slot">
                <div bind:this={antiHandles[i]}>
                    <MixerSlot {sampler} slot={i} />
                </div>
                <span class="no-highlight">({keyMap[i]})</span>
            </div>
        {/each}
    </div>
</Dragable>

<style>
    #mixer {
        display: flex;
        gap: 10px;
        width: fit-content;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 10px;
        border: 1px solid black;
        border-radius: 5px;
    }
    .mixer-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .no-highlight {
        user-select: none;
        -webkit-user-select: none; /* For Safari and Chrome */
        -moz-user-select: none; /* For Firefox */
        -ms-user-select: none; /* For Internet Explorer/Edge */
    }
</style>