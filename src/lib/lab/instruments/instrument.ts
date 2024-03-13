class Instrument {
    ctx: AudioContext;
    output: any;

    constructor(context: AudioContext) {
        this.ctx = context;
        this.output = this.ctx.createGain();
        this.init();
    }
    init() {
        console.warn('init() not implemented.');
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
    sendNoteOn(note: number, velocity?: number, time?: number) {
        throw new Error('Method not implemented.');
    }
    sendNoteOff(time?: number) {
        throw new Error('Method not implemented.');
    }
    static midiToHz(midiNote: number): number {
        const a = 440; // Frequency of A4 (MIDI note 69)
        return a * Math.pow(2, (midiNote - 69) / 12);
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