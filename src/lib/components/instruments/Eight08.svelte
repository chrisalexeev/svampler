<script lang="ts">
    import { onMount } from "svelte";
    import { Eight08 as Eight08Inst } from "../../lab/instruments/eight08";

    export let eight08: Eight08Inst;

    onMount(() => {
        eight08.init();
        eight08.setRelease(1);
    });

    function playNote() {
        eight08.sendNoteOn(50);
    }
    function stopNote() {
        eight08.sendNoteOff();
    }
</script>

<div>
    <button on:mousedown={playNote} on:mouseup={stopNote}>SLAM THAT SHIT</button>
</div>

<style>
    div {
        background-color: red;
    }
</style>
