<script lang="ts">
    import { sampler, library } from "../lab";

    function handleDragStart(e: DragEvent) {
        e.dataTransfer?.setData(
            "text",
            (e.target as HTMLElement).textContent || "",
        );
    }

    function handlePreview(sound: string) {
        library.previewSample(sampler.context!, sound);
    }
</script>

<div id="library">
    {#each Object.keys(library.samples) as sound}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            draggable="true"
            on:dragstart={handleDragStart}
            class="library-entry no-highlight"
        >
            <span>{sound}</span>
            <button on:click={() => handlePreview(sound)}>
                <img src="/play.svg" alt="Play" class="play-button" />
            </button>
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
        display: flex;
        justify-content: space-between;
        gap: 5px;
    }
    .no-highlight {
        user-select: none;
        -webkit-user-select: none; /* For Safari and Chrome */
        -moz-user-select: none; /* For Firefox */
        -ms-user-select: none; /* For Internet Explorer/Edge */
    }
    button {
        all: unset;
        cursor: pointer;
    }
    img {
        width: 1rem;
        height: 1rem;
        padding-right: 5px;
        opacity: 0.5;
    }
</style>
