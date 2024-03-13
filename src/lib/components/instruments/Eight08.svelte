<script lang="ts">
    import { onMount } from "svelte";
    import { Eight08 as Eight08Inst, keyMap } from "../../lab/instruments";
    import { eventProcessor } from "../../lab";

    export let eight08: Eight08Inst;

    function handle808NoteDown(topic: string | number, note: number) {
        if (topic === "noteDown") {
            eight08.sendNoteOn(note + 24);
        }
    }

    function handle808NoteUp(topic: string | number, note: number) {
        if (topic === "noteUp") {
            eight08.sendNoteOff(note + 24);
        }
    }

    onMount(() => {
        eight08.init();
        eight08.setRelease(2);
        eventProcessor.subscribe("noteDown", handle808NoteDown);
        eventProcessor.subscribe("noteUp", handle808NoteUp);
        return () => {
            eventProcessor.unsubscribe("noteDown", handle808NoteDown);
            eventProcessor.unsubscribe("noteUp", handle808NoteUp);
        };
    });
</script>

<div>
    I am 808
</div>

<style>
    div {
        background-color: red;
    }
</style>
