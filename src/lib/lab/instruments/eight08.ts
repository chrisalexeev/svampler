import { AmpEnvelope } from "./envelope";
import { MonoInstrument } from "./instrument";
import { midiToHz } from "./util";

export class MonoOsc extends MonoInstrument {
    osc!: OscillatorNode;
    timeout: number | undefined;
    envelope!: AmpEnvelope;
    currentNote: number | null = null;
    _octave: number = 2;
    _release: number = 0.1;
    _slide: number = 0;
    _noteQueue: number[] = [];
    
    init() {
        this.envelope = new AmpEnvelope(this.ctx);
        this.envelope.attack = 0.001;
        const [effectsIn, effectsOut] = this.createEffects();
        this.envelope.connect(effectsIn);
        effectsOut.connect(this.output);
        this.osc = this.createSource();
    }
    private createEffects() {
        const gainNodeIn = this.ctx.createGain();
        const gainNodeOut = this.ctx.createGain();
        const compressor = this.ctx.createDynamicsCompressor();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 2;

        compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
        compressor.ratio.setValueAtTime(200, this.ctx.currentTime);
        compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
        compressor.release.setValueAtTime(0.1, this.ctx.currentTime);
        gainNodeIn.gain.value = 200;
        gainNodeOut.gain.value = 0.1;
        gainNodeIn.connect(compressor);
        compressor.connect(filter);
        filter.connect(gainNodeOut);
        return [gainNodeIn, gainNodeOut]
    }
    createSource() {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 440;
        osc.connect(this.envelope.input);
        osc.start();
        return osc;
    }
    sendNoteOn(note: number, _velocity?: number | undefined, time?: number | undefined): void {
        if (this.currentNote === note) return;
        this._noteQueue.push(note);
        const tTime = time ?? this.ctx.currentTime;
        const frequency = midiToHz(note + (this._octave * 12));
        if (this.currentNote === null) {
            this.envelope.triggerAttack(time);
            this.osc.frequency.exponentialRampToValueAtTime(frequency * 2, tTime + 0.01);
            this.osc.frequency.exponentialRampToValueAtTime(frequency, tTime + 0.02);
        } else {
            this.osc.frequency.exponentialRampToValueAtTime(frequency, tTime + this._slide);
        }
        this.currentNote = note;
    }
    sendNoteOff(note: number, time?: number): void {
        if (this.currentNote === null) return;
        this._noteQueue = this._noteQueue.filter(n => n !== note);
        if (this._noteQueue.length > 0) {
            this.sendNoteOn(this._noteQueue.pop()!, undefined, time);
            return;
        }
        this.currentNote = null;
        const tTime = time ?? this.ctx.currentTime;
        this.envelope.triggerRelease(tTime);
    }
    get octave() {
        return this._octave;
    }
    set octave(value: number) {
        if (value === undefined || value < 0 || value > 6) return;
        this._octave = value;
    }
    set release(value: number) {
        if (!this.envelope || value === undefined) return;
        this.envelope.release = value;
    }
    set slide(value: number) {
        this._slide = value;
    }
}