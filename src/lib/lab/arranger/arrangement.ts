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
    readonly id: number;

    constructor(bars: number = 1, start = 0) {
        if (bars < 1) {
            throw new Error("Arrangement must have at least one bar.");
        }
        this.bars = bars;
        this.start = start;
        this.id = this.createId();
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
        console.log(this);
        for (const instrument of this.instruments) {
            for (const note of Object.values(this.notes)) {
                console.log(note);
                instrument.triggerNoteOn(note.value, note.velocity, note.start);
                instrument.triggerNoteOff(note.value, note.end);
            }
        }
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