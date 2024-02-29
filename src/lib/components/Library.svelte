<script lang="ts">
    import { sampler } from "../sampler/vtsampler";
</script>

<div id="library">
    {#each Object.keys(sampler.library.samples) as sound}
        <div>{sound}</div>
    {/each}
</div>

<style>
    #library {
        max-height: 500px;
        overflow-y: auto;
        position: relative;
        display: flex;
        flex-direction: column;
    }
</style>
