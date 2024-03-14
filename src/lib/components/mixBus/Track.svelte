<script lang="ts">
    import { mixBus } from "$lab";

    export let track: number;
    let volume = 1;
    $: handleVolumeChange(volume);

    const trackId = `track${track}`;

    function handleVolumeChange(vol: number) {
        mixBus.tracks[track].setGain(vol);
    }
</script>

<div>
    <label for={`${trackId}-gain`}>Volume</label>
    <input name={`${trackId}-gain`} type="range" min="0" max="1" step="0.01" bind:value={volume} />
</div>