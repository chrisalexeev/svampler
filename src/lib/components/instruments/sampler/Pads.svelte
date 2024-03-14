<script lang="ts">
    import type { Sampler } from "../../../lab";
    import Pad from "./Pad.svelte";
    export let sampler: Sampler;
    const left = {
        "w": 3,
        "a": 0,
        "s": 1,
        "d": 2,
    } as Record<string, number>;
    const right = {
        "i": 7,
        "j": 4,
        "k": 5,
        "l": 6,
    } as Record<string, number>;

</script>

<div id="pads">
    <div class="pad-section left">
        {#each Object.keys(left) as key}
            <div>
                <Pad name={""} {key} {sampler} slot={left[key]} />
            </div>
        {/each}
    </div>
    <div class="pad-section right">
        {#each Object.keys(right) as key}
            <div>
                <Pad name={""} {key} {sampler} slot={right[key]} />
            </div>
        {/each}
    </div>
</div>

<style>
    #pads {
        display: flex;
        /* grid-template-columns: repeat(3, fit-content(100px)); */
        gap: 10px;
        background-color: rgba(0,0,0,0.2);
        width: min-content;
        padding: 10px;
        border: 1px solid black;
        border-radius: 5px;
    }
    .pad-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
    .pad-section > :nth-child(1) {
        grid-column: 2; /* Occupy the middle column on top */
        grid-row: 1;
    }

    .pad-section > :nth-child(2) {
        grid-column: 1; /* Left column on the bottom row */
        grid-row: 2;
    }

    .pad-section > :nth-child(3) {
        grid-column: 2; /* Middle column on the bottom row */
        grid-row: 2;
    }

    .pad-section > :nth-child(4) {
        grid-column: 3; /* Right column on the bottom row */
        grid-row: 2;
    }
</style>
