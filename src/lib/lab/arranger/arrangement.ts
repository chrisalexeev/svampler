import { globalControl } from "../globalControl";
import type { Playable } from "../instruments/playable";
import { createId } from "../util";
import { Note } from "./note";

export class Arrangement {
    private static ids = new Set<number>();
    start = 0;
    bars: number = 1;
    notes: Record<number, Note> = {};
    instruments: Set<Playable> = new Set();
    frame: number = 0;
    readonly id: number;
    private prioritytQueueStart: Note[] = [];
    private prioritytQueueEnd: Note[] = [];
    private isPlaying: boolean = false;

    constructor(bars: number = 1, start = 0) {
        if (bars < 1) {
            throw new Error("Arrangement must have at least one bar.");
        }
        this.bars = bars;
        this.start = start;
        this.id = this.createId();
        this.frame = globalControl.ctx.currentTime;
    }

    addNote(note: Note) {
        this.notes[note.id] = note;
    }

    removeNote(note: Note) {
        delete this.notes[note.id];
    }

    get end() {
        return this.start + this.bars * 4 * 60 / this.bpm;
    }

    get bpm() {
        return globalControl.bpm;
    }

    play() {
        this.isPlaying = true;
        this.prioritytQueueStart = Object.values(this.notes).sort((a, b) => a.start - b.start);
        this.prioritytQueueEnd = Object.values(this.notes).sort((a, b) => a.end - b.end);
        this.frame = globalControl.ctx.currentTime;
        requestAnimationFrame(this.run.bind(this));
    }

    stop() {
        this.isPlaying = false;
        if (this.prioritytQueueEnd.length > this.prioritytQueueStart.length) {
            while (this.prioritytQueueEnd.length > this.prioritytQueueStart.length) {
                this.instruments.forEach(instrument => {
                    instrument.triggerNoteOff(this.prioritytQueueEnd.shift()!.value);
                });
            }
        }
    }

    run() {
        const delta = globalControl.ctx.currentTime - this.frame;
        let bars = delta / (60 / this.bpm * 4);
        if (bars > 1) {
            this.prioritytQueueStart = Object.values(this.notes).sort((a, b) => a.start - b.start);
            this.prioritytQueueEnd = Object.values(this.notes).sort((a, b) => a.end - b.end);
            this.frame = globalControl.ctx.currentTime;
            bars = 0;
        }
        const nextStart = this.prioritytQueueStart[0];
        const nextEnd = this.prioritytQueueEnd[0];
        if (nextStart && bars >= nextStart.start) {
            this.instruments.forEach(instrument => {
                instrument.triggerNoteOn(this.prioritytQueueStart.shift()!.value);
            });
        }
        if (nextEnd && bars >= nextEnd.end) {
            this.instruments.forEach(instrument => {
                instrument.triggerNoteOff(this.prioritytQueueEnd.shift()!.value);
            });
        }
        this.isPlaying && requestAnimationFrame(this.run.bind(this));
    }


    connectInstrument(instrument: Playable) {
        this.instruments.add(instrument);
    }

    disconnectInstrument(instrument: Playable) {
        this.instruments.delete(instrument);
    }

    createId() {
        let id = createId();
        while (Arrangement.ids.has(id)) {
            id = createId();
        }
        Arrangement.ids.add(id);
        return id;
    }
}