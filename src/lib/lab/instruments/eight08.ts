import { AmpEnvelope } from "./envelope";
import { MonoInstrument } from "./instrument";
import { midiToHz } from "./util";



export class Eight08 extends MonoInstrument {
    osc!: OscillatorNode;
    timeout: number | undefined;
    envelope!: AmpEnvelope;
    init() {
        this.envelope = new AmpEnvelope(this.ctx);
        this.envelope.attack = 1;
        const [effectsIn, effectsOut] = this.createEffects();
        this.envelope.connect(effectsIn);
        effectsOut.connect(this.output);
        this.osc = this.createSource();
    }
    private createEffects() {
        const gainNodeIn = this.ctx.createGain();
        const gainNodeOut = this.ctx.createGain();
        const compressor = this.ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
        compressor.ratio.setValueAtTime(20, this.ctx.currentTime);
        compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
        compressor.release.setValueAtTime(0.01, this.ctx.currentTime);
        gainNodeIn.gain.value = 20;
        gainNodeOut.gain.value = 0.1;
        gainNodeIn.connect(compressor);
        compressor.connect(gainNodeOut);
        return [gainNodeIn, gainNodeOut]
    }
    createSource() {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 440;
        osc.connect(this.envelope.input);
        osc.start();
        return osc;
    }
    sendNoteOn(note: number, _velocity?: number | undefined, time?: number | undefined): void {
        const tTime = time ?? this.ctx.currentTime;
        const frequency = midiToHz(note);
        this.osc.frequency.exponentialRampToValueAtTime(frequency, tTime + 0.001);
        this.envelope.triggerAttack(time);
    }
    sendNoteOff(time?: number): void {
        const tTime = time ?? this.ctx.currentTime;
        this.envelope.triggerRelease(tTime);
    }
    setRelease(value: number) {
        this.envelope.release = value;
    }
}