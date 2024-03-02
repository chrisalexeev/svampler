<script lang="ts">
    import { sampler } from "../sampler";

    function handleDragStart(e: DragEvent) {
        e.dataTransfer?.setData(
            "text",
            (e.target as HTMLElement).textContent || "",
        );
    }
</script>

<div id="library">
    {#each Object.keys(sampler.library.samples) as sound}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            draggable="true"
            on:dragstart={handleDragStart}
            class="library-entry no-highlight"
        >
            {sound}
        </div>
    {/each}
</div>

<style>
    #library {
        overflow-y: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        max-height: 100%;
    }
    .library-entry {
        padding: 1px;
        border: 1px solid #000;
    }
    .no-highlight {
        user-select: none;
        -webkit-user-select: none; /* For Safari and Chrome */
        -moz-user-select: none; /* For Firefox */
        -ms-user-select: none; /* For Internet Explorer/Edge */
    }
</style>
