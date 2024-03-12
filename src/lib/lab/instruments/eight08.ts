import { AmpEnvelope } from "./envelope";
import { MonoInstrument } from "./instrument";
import { midiToHz } from "./util";

export class Eight08 extends MonoInstrument {
    osc!: OscillatorNode;
    timeout: number | undefined;
    envelope!: AmpEnvelope;
    currentNote: number | null = null;
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
        // console.count('sendNoteOn')
        const tTime = time ?? this.ctx.currentTime;
        const frequency = midiToHz(note);
        this.osc.frequency.exponentialRampToValueAtTime(frequency * 2, tTime + 0.01);
        this.osc.frequency.exponentialRampToValueAtTime(frequency, tTime + 0.02);
        this.currentNote ?? this.envelope.triggerAttack(time);
        this.currentNote = note;
    }
    sendNoteOff(note: number, time?: number): void {
        if (this.currentNote === null || this.currentNote !== note) return;
        this.currentNote = null;
        // console.count('sendNoteOff')
        const tTime = time ?? this.ctx.currentTime;
        this.envelope.triggerRelease(tTime);
    }
    setRelease(value: number) {
        this.envelope.release = value;
    }
}