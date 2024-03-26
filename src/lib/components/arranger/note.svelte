<script lang="ts">
    import type { Note } from "$lib/lab/arranger";

    export let note: Note;
    let duration = note.duration;

    function handleDragBody(e: DragEvent) {
        e.dataTransfer?.setData(
            "text/plain",
            JSON.stringify({ type: "move", id: note.id }),
        );
    }

    function handleDragExtend(e: DragEvent) {
        e.dataTransfer?.setData(
            "text/plain",
            JSON.stringify({ type: "extend", id: note.id }),
        );
    }

    function handleExtending(e: DragEvent) {
        e.preventDefault();
        // holy fucking shit this is bad lmao
        const dragLoc =
            e.offsetX /
            (
                ((e.target as HTMLElement).parentNode as HTMLElement)
                    .parentNode as HTMLElement
            ).getBoundingClientRect().width;
        duration = dragLoc - note.start;
        console.log(e);
    }
</script>

<div
    class="note"
    style={`width: ${duration * 100}%; left: ${note.start * 100}%;`}
>
    <div class="note-start" />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div draggable="true" on:dragstart={handleDragBody} class="note-body"></div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        draggable="true"
        class="note-end"
        on:dragstart={handleDragExtend}
        on:drag={handleExtending}
    />
</div>

<style>
    .note {
        display: flex;
        position: absolute;
        height: 100%;
    }

    .note-start {
        width: 5px;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 5px 0 0 5px;
    }

    .note-end {
        width: 5px;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 0 5px 5px 0;
        cursor: e-resize;
    }

    .note-body {
        background-color: rgba(255, 255, 255, 0.9);
        width: 100%;
    }
</style>
