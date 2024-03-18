<script lang="ts">
    import type { Note } from "$lib/lab/arranger";

    export let note: Note;
    export let scaleX = 1;

    // function handle
</script>

<div
    class="note"
    style={
        `width: ${note.duration * 100}px;
        transform: scaleX(${scaleX}));
        left: ${note.start * 100}px;
        `
    }
/>

<style>
    .note {
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid black;
        border-radius: 5px;
        height: 100%;
        position: absolute;
    }
</style>