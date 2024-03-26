<script lang="ts">
    import { REFRESH_NOTES } from "$lib/constants/topics";
    import { eventProcessor } from "$lib/lab";
    import { Note as NoteObj, type Arrangement } from "$lib/lab/arranger";
    import { invoker } from "$lib/lab/commands";
    import { AddNoteCommand } from "$lib/lab/commands/arranger";
    import { onMount } from "svelte";
    import Note from "./note.svelte";
    // import { Note } from "$lib/lab/arranger";
    // import { onMount } from "svelte";

    export let arrangement: Arrangement;
    let notes = Object.values(arrangement.notes);
    let subdivision = 8;

    function createDropHandler(pitch: number) {
        return (e: DragEvent) => {
            e.preventDefault();
            console.log(e);
            if (e.dataTransfer?.types[0] !== "text/plain") return;
            const obj = JSON.parse(e.dataTransfer?.getData("text/plain"));
            const type = obj.type;
            if (type === "extend") {
                const note = arrangement.notes[obj.id]!;
                const dragLoc =
                    e.offsetX /
                    (e.target as HTMLElement).getBoundingClientRect().width;
                const quantizedLoc =
                    Math.round(dragLoc * subdivision) / subdivision;
                note.end = quantizedLoc;
                eventProcessor.dispatchEvent(REFRESH_NOTES, arrangement.id);
                return;
            }
            const draggingNote = obj.id;
            console.log("dropped", draggingNote, pitch);
            const dragLoc =
                e.offsetX /
                (e.target as HTMLElement).getBoundingClientRect().width;
            const quantizedLoc =
                Math.floor(dragLoc * subdivision) / subdivision;
            arrangement.notes[draggingNote]!.start = quantizedLoc;
            arrangement.notes[draggingNote]!.end =
                quantizedLoc + 1 / subdivision;
            arrangement.notes[draggingNote]!.value = pitch;
            eventProcessor.dispatchEvent(REFRESH_NOTES, arrangement.id);
        };
    }

    function createDblClickHandler(pitch: number) {
        return (e: MouseEvent) => {
            const clickLoc =
                e.offsetX /
                (e.target as HTMLElement).getBoundingClientRect().width;
            const quantizedLoc =
                Math.floor(clickLoc * subdivision) / subdivision;
            const note = new NoteObj(
                pitch,
                quantizedLoc,
                quantizedLoc + 1 / subdivision,
                100,
            );
            invoker.execute(new AddNoteCommand(arrangement, note));
        };
    }

    function handleRefreshNotes(arrId: number) {
        if (arrId !== arrangement.id) return;
        console.log("refreshing notes", arrId, arrangement.id);
        notes = Object.values(arrangement.notes);
        console.log(notes);
    }

    onMount(() => {
        eventProcessor.subscribe(REFRESH_NOTES, handleRefreshNotes);
        return () => {
            eventProcessor.unsubscribe(REFRESH_NOTES, handleRefreshNotes);
        };
    });
</script>

<div class="arrangement">
    {#each { length: 127 } as _, i}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="row"
            on:dragover={(e) => e.preventDefault()}
            on:drop={createDropHandler(i)}
            on:dblclick={createDblClickHandler(i)}
        >
            {#each notes as note}
                {#if note.value === i}
                    <Note {note} />
                {/if}
            {/each}
        </div>
    {/each}
</div>

<style>
    .arrangement {
        display: flex;
        flex-direction: column-reverse;
        min-width: 400px;
        max-height: 200px;
        overflow: auto;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 20px;
    }

    .arrangement > :nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .row {
        position: relative;
        height: 100%;
        width: 100%;
        min-height: 7px;
    }

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
