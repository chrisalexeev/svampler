<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { eventProcessor, Sampler } from "../lab";
    export let name: string;
    export let slot: number;
    export let key: string;
    export let sampler: Sampler;
    let drop: HTMLButtonElement;
    let className = "drum-pad";
    $: className = pressed ? "drum-pad active" : "drum-pad";

    function handleDragover(e: DragEvent) {
        e.preventDefault();
    };
    function handleDrop(e: DragEvent) {
        e.preventDefault();
        const text = e.dataTransfer?.getData("text");
        if (!text) return;
        sampler.loadSample(slot, text);
    };
    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === key) eventProcessor.dispatchEvent(slot);
    };

    onMount(() => {
        drop.addEventListener("dragover", handleDragover);
        drop.addEventListener("drop", handleDrop);
        document.addEventListener("keydown", handleKeyDown);
    });

    onDestroy(() => {
        drop.removeEventListener("dragover", handleDragover);
        drop.removeEventListener("drop", handleDrop);
        document.removeEventListener("keydown", handleKeyDown);
    });

    let pressed = false;
    eventProcessor.subscribe(slot, () => {
        pressed = true;
        setTimeout(() => {
            pressed = false;
        }, 50);
    });
</script>

<button
    class={className}
    on:click={() => eventProcessor.dispatchEvent(slot)}
    bind:this={drop}
>
    {name + (key ? ` (${key})` : "")}
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
