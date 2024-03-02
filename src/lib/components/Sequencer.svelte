<script lang="ts">
    import { sampler, eventProcessor } from "../sampler";
    import Dragable from "./shared/Dragable.svelte";

    export let numBeats = 32;
    const numSlots = sampler.maxSamples;

    let bpm = 120;
    let interval: number;
    let debounceTimer: number;
    let running = false;
    const slots: number[][] = new Array(numBeats).fill([]); // TODO: make single array
    let idx = 0;
    let handle0: HTMLElement | null = null;
    let handle1: HTMLElement | null = null;
    let anitHandle0: HTMLElement | null = null;
    let handles: HTMLElement[] = [];
    let antiHandles: HTMLElement[] = [];

    $: handles = [handle0, handle1].filter((h) => h !== null) as HTMLElement[];
    $: antiHandles = [anitHandle0].filter((h) => h !== null) as HTMLElement[];

    $: onChangeTempo(bpm);

    function start() {
        if (running) {
            return;
        } else {
            interval = setInterval(
                () => {
                    tick();
                },
                ((60 / bpm) * 1000) / 4,
            );
            running = true;
        }
    };

    function stop() {
        if (!running) idx = 0;
        clearInterval(interval);
        running = false;
    };

    function restart() {
        stop();
        start();
    };

    function clear() {
        slots.forEach((_, i) => {
            slots[i] = [];
        });
    }

    function tick() {
        slots[idx].forEach((sound) => {
            eventProcessor.dispatchEvent(sound);
        });
        idx = (idx + 1) % numBeats;
    };

    const toggleSlotSound = (beat: number, sound: number) => {
        const slot = slots[beat];
        const idx = slot.indexOf(sound);
        if (idx === -1) {
            slots[beat] = [...slot, sound];
        } else {
            slots[beat] = [...slot.slice(0, idx), ...slot.slice(idx + 1)];
        }
    };

    function onChangeTempo(value: number) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            bpm = value;
            if (running) restart();
        }, 100);
    };
</script>

<Dragable {handles} {antiHandles}>
    <div id="sequencer">
        <div id="controls" bind:this={handle0}>
            <div id="bpm" bind:this={anitHandle0}>
                <label for="bpm">BPM: {bpm}</label>
                <input
                    name="bpm"
                    type="range"
                    min="60"
                    max="240"
                    bind:value={bpm}
                />
            </div>
            <button on:click={start}>Start</button>
            <button on:click={stop}>Stop</button>
            <button on:click={clear}>Clear</button>
        </div>
        <div class="slots-container">
            <div class="slot-labels" bind:this={handle1}>
                {#each {length: numSlots} as _, i}
                    <span>{i}</span>
                {/each}
            </div>
            <div class="slots">
                {#each slots as _, i}
                    <div class="slot" class:active={i === idx}>
                        {#each {length: numSlots} as _, j}
                            <button
                                class="slot-sound"
                                on:click={() => toggleSlotSound(i, j)}
                            >
                                <input
                                    type="checkbox"
                                    class="sound-name"
                                    name={`${i}-${j}`}
                                    checked={slots[i].includes(j)}
                                />
                            </button>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</Dragable>

<style>
    #sequencer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
    #bpm {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        z-index: 1000;
    }
    input[type="checkbox"] {
        /* Add if not using autoprefixer */
        -webkit-appearance: none;
        appearance: none;
        /* For iOS < 15 to remove gradient background */
        background-color: #fff;
        /* Not removed via appearance */
        margin: 0;

        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border: 0.15em solid currentColor;
        border-radius: 0.15em;
        transform: translateY(-0.075em);
        display: grid;
        place-content: center;
    }
    input[type="checkbox"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--form-control-color);
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);
    }
    input[type="checkbox"]:checked {
        background-color: red;
    }
    #controls {
        display: flex;
        gap: 10px;
        width: 100%;
        justify-content: center;
    }
    .slots-container {
        display: flex;
    }
    .slots {
        display: flex;
        border: solid rgb(64, 64, 64) 2px;
        border-radius: 4px;
    }

    .slots > :nth-child(4n) {
        border-right: solid rgb(64, 64, 64) 2px;
    }
    .slots > :last-child {
        border-right: unset;
    }
    .slot-labels {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: space-around;
        padding: 0 10px;
    }

    .slot-labels > span {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .slot {
        display: flex;
        flex-direction: column;
    }

    .slot-sound {
        all: unset;
        cursor: pointer;
        display: flex;
        gap: 10px;
    }

    .slot-sound * {
        cursor: pointer;
    }

    .slot > :nth-child(odd) {
        /* Styles for odd child elements */
        background-color: rgb(255, 255, 255, 0.2);
    }

    .slot > * {
        /* Styles for all child elements */
        padding: 15px 15px;
    }

    .slot.active {
        background-color: rgb(255, 255, 255, 0.2);
    }
</style>
