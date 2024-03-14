<script lang="ts">
    import { mixBus } from "$lab";
    import Track from "./Track.svelte";

</script>


<div>
    {#each mixBus.tracks as _, track}
        <Track {track} />
    {/each}
</div>