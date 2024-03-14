<script lang="ts">
    import { onMount } from "svelte";
    import { MonoOsc as MonoOscInst } from "$lab/instruments";
    import { eventProcessor } from "$lab";
    import {
        NOTE_DOWN,
        NOTE_UP,
        OCTAVE_CHANGE,
    } from "$lib/constants/topics";

    export let monoOsc: MonoOscInst;
    let release = 1;
    let slide = 0;

    $: monoOsc.release = release;
    $: monoOsc.slide = slide;

    function handleMonoOscNoteDown(topic: string | number, note: number) {
        if (topic !== NOTE_DOWN) return;
        monoOsc.sendNoteOn(note);
    }

    function handleMonoOscNoteUp(topic: string | number, note: number) {
        if (topic !== NOTE_UP) return;
        monoOsc.sendNoteOff(note);
    }

    function handleOctaveChange(topic: string | number, delta: number) {
        if (topic !== OCTAVE_CHANGE || Math.abs(delta) !== 1) return;
        console.log("octave change");
        monoOsc.octave = monoOsc.octave + delta;
        
    }

    onMount(() => {
        monoOsc.init();
        release = 1;
        eventProcessor.subscribe(NOTE_DOWN, handleMonoOscNoteDown);
        eventProcessor.subscribe(NOTE_UP, handleMonoOscNoteUp);
        eventProcessor.subscribe(OCTAVE_CHANGE, handleOctaveChange);
        return () => {
            eventProcessor.unsubscribe(NOTE_DOWN, handleMonoOscNoteDown);
            eventProcessor.unsubscribe(NOTE_UP, handleMonoOscNoteUp);
            eventProcessor.unsubscribe(OCTAVE_CHANGE, handleOctaveChange);
        };
    });
</script>

<div>
    <h1>Mono0sc</h1>
    <label for="808-release">Release</label>
    <input type="range" min="0.1" max="3.0" step="0.1" bind:value={release} />
    <label for="808-slide">Slide</label>
    <input type="range" min="0.0" max="0.5" step="0.01" bind:value={slide} />
</div>

<style>
    div {
        text-align: center;
        padding: 1rem;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        border: solid black 1px;
    }
</style>
