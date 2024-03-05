<script lang="ts">
    import { sampler, eventProcessor } from "../sampler";
    export let slot: number;

    let sample = sampler.samples[slot];
    let val = 1;

    function handleValChange(gain: number) {
        if (!sample) return;
        sampler.samples[slot]!.gain = gain;
    }
    $: handleValChange(val);

    // not totally sure if this is sus or not
    // on one hand, we're not leveraging Svelte's reactivity
    // on the other hand, the sampler isn't dependent on Svelte
    eventProcessor.subscribe(`sample-loaded-${slot}`, (s) => {
        sample = sampler.samples[slot];
    });
</script>

<div>
    <input
        disabled={!sample}
        type="range"
        min="0"
        max="1"
        step="0.01"
        bind:value={val}
    />
</div>

<style>
    input[type="range"] {
        appearance: slider-vertical;
        width: 8px;
        height: 175px;
        padding: 0 5px;
    }
</style>
