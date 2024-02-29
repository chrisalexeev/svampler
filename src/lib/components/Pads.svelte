<script lang="ts">
    import Pad from "./Pad.svelte";
    export let pads: { key: string; sound: string }[];
</script>

<div id="pads">
    {#each pads as pad}
        <Pad name={pad.sound} key={pad.key} />
    {/each}
</div>

<style>
    #pads {
        display: grid;
        grid-template-columns: repeat(3, fit-content(100px));
        gap: 10px;
    }
</style>
