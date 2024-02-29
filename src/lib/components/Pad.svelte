<script lang="ts">
    import { eventProcessor } from "../sampler";
    export let name: string;
    export let key: string | null = null;
    let pressed = false;
    let className = "drum-pad";
    $: className = pressed ? "drum-pad active" : "drum-pad";
    eventProcessor.subscribe(name, () => {
        pressed = true;
        setTimeout(() => {
            pressed = false;
        }, 50);
    });
</script>

<button class={className} on:click={() => eventProcessor.dispatchEvent(name)}>
    {#if name}
        {name + (key ? ` (${key})` : "")}
    {/if}
</button>

<style>
    .drum-pad {
        width: 120px;
        height: 120px;
        color: white;
        background-color: rgb(97, 97, 97);
    }
    .drum-pad.active {
        background-color: rgb(0, 0, 0);
    }
</style>
