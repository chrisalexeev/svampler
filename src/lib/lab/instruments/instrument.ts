import { createId } from "../util";
import type { Playable } from "./playable";

class Instrument implements Playable {
    static ids = new Set<number>();
    readonly id: number;
    ctx: AudioContext;
    output: any;
    name: string;

    constructor(context: AudioContext, name?: string) {
        this.ctx = context;
        this.output = this.ctx.createGain();
        this.id = Instrument.createId();
        this.name = name || `Instrument-${Math.round(Math.random() * 1000)}`;
    }
    createSource() {
        return this.ctx.createOscillator();
    }
    connect(destination: any) {
        this.output.connect(destination);
    }
    disconnect() {
        this.output.disconnect();
    }
    triggerNoteOn(note: number, velocity?: number, time?: number) {
        throw new Error('Method not implemented.');
    }
    triggerNoteOff(note: number, time?: number) {
        throw new Error('Method not implemented.');
    }
    static midiToHz(midiNote: number): number {
        const a = 440; // Frequency of A4 (MIDI note 69)
        return a * Math.pow(2, (midiNote - 69) / 12);
    }
    static createId() {
        let id = createId();
        while (Instrument.ids.has(id)) {
            id = Math.round(Math.random() * 1000);
        }
        Instrument.ids.add(id);
        return id;
    }
}

export class MonoInstrument extends Instrument {
    isOn = false;
};

export class PolyInstrument extends Instrument {

    poolSize = 10;
    sourcePool: OscillatorNode[];

    constructor(context: AudioContext) {
        super(context);
        this.sourcePool = new Array(this.poolSize).fill(0).map(() => this.createSource());
    }

    getOscillatorFromPool() {
        if (this.sourcePool.length > 0) {
            return this.sourcePool.pop();
        } else {
            return this.createSource();
        }
    }

    recycle(oscillator: OscillatorNode) {
        oscillator.disconnect();
        if (this.sourcePool.length < this.poolSize) {
            this.sourcePool.push(oscillator);
        }
    }
}

export type InstConstructor<T extends Instrument> = new (ctx: AudioContext, name?: string) => T;
