<script lang="ts">
    import { sampler } from "../sampler";
</script>

<div id="library">
    {#each Object.keys(sampler.library.samples) as sound}
        <div>{sound}</div>
    {/each}
</div>

<style>
    #library {
        overflow-y: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
