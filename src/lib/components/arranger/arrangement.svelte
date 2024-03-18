<script lang="ts">
    import { REFRESH_NOTES } from "$lib/constants/topics";
    import { eventProcessor } from "$lib/lab";
    import { Note, type Arrangement } from "$lib/lab/arranger";
    import { invoker } from "$lib/lab/commands";
    import { AddNoteCommand } from "$lib/lab/commands/arranger";
    import { onMount } from "svelte";
    // import { Note } from "$lib/lab/arranger";
    // import { onMount } from "svelte";

    export let arrangement: Arrangement;
    let notes = Object.values(arrangement.notes);
    let draggingNote: number | null = null;
    let subdivision = 8;

    function createDragHandler(noteId: number) {
        return (e: DragEvent) => {
            draggingNote = noteId;
        };
    }

    function preventDefault(e: DragEvent) {
        e.preventDefault();
    }
    
    function createDropHandler(pitch: number) {
        return (e: DragEvent) => {
            e.preventDefault();
            if (draggingNote === null) return;
            console.log("dropped", draggingNote, pitch);
            const dragLoc = e.offsetX / (e.target as HTMLElement).getBoundingClientRect().width;
            const quantizedLoc = Math.floor(dragLoc * subdivision) / subdivision;
            arrangement.notes[draggingNote]!.start = quantizedLoc;
            arrangement.notes[draggingNote]!.end = quantizedLoc + 1 / subdivision;
            arrangement.notes[draggingNote]!.value = pitch;
            draggingNote = null;
            eventProcessor.dispatchEvent(REFRESH_NOTES, arrangement.id);
        };
    }

    function createDblClickHandler(pitch: number) {
        return (e: MouseEvent) => {
            const clickLoc = e.offsetX / (e.target as HTMLElement).getBoundingClientRect().width;
            const quantizedLoc = Math.floor(clickLoc * subdivision) / subdivision;
            const note = new Note(pitch, quantizedLoc, quantizedLoc + 1 / subdivision, 100);
            invoker.execute(new AddNoteCommand(arrangement, note));
        };
    }
    
    onMount(() => {
        eventProcessor.subscribe(REFRESH_NOTES, (arrId) => {
            if (arrId !== arrangement.id) return;
            console.log("refreshing notes", arrId, arrangement.id)
            notes = Object.values(arrangement.notes);
            console.log(notes);
        });
        // const note = new Note(32, 0, 0.5, 100);
        // invoker.execute(new AddNoteCommand(arrangement, note));
        // const note2 = new Note(64, 0.5, 0.75, 100);
        // invoker.execute(new AddNoteCommand(arrangement, note2));
    });
</script>

<div class="arrangement">
    {#each {length: 127} as _, i}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="row" on:dragover={preventDefault} on:drop={createDropHandler(i)} on:dblclick={createDblClickHandler(i)}>
            {#each notes as note}
                {#if note.value === i}
                    <div draggable={true} on:dragstart={createDragHandler(note.id)} class="note" style="width: {note.duration * 100}%; transform: scaleX(1); left: {note.start * 100}%;"></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>

<style>
    .arrangement {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        max-height: 200px;
        overflow: auto;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 20px;
    }

    .arrangement>:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .row {
        position: relative;
        height: 100%;
        width: 100%;
        min-height: 7px;
    }

    .note {
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 5px;
        height: 100%;
        position: absolute;
    }
</style>