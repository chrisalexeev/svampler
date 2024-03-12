export class AmpEnvelope {
    node: GainNode;
    attack: number;
    decay: number;
    release: number;
    sustain: number;

    constructor(context: any) {
        this.node = context.createGain();
        this.node.gain.value = 0;

        this.attack = 0.5;
        this.decay = 0.1;
        this.release = 0.1;
        this.sustain = 1;
    }

    connect(destination: any) {
        this.node.connect(destination);
    }

    disconnect() {
        this.node.disconnect();
    }

    get input() {
        return this.node;
    }

    setGain(value: number) {
        this.node.gain.value = value;
    }

    triggerAttack(when?: number) {
        const tTime = when ?? this.node.context.currentTime;
        this.node.gain.cancelScheduledValues(tTime);
        this.node.gain.setValueAtTime(0, tTime);
        this.node.gain.linearRampToValueAtTime(1, tTime + this.attack);
        this.node.gain.linearRampToValueAtTime(this.sustain, tTime + this.attack + this.decay);
    }

    triggerRelease(when?: number) {
        const tTime = when ?? this.node.context.currentTime;
        this.node.gain.cancelScheduledValues(tTime);
        this.node.gain.setValueAtTime(this.node.gain.value, tTime);
        this.node.gain.linearRampToValueAtTime(0, tTime + this.release);
    }

    abort(when?: number) {
        const tTime = when ?? this.node.context.currentTime;
        this.node.gain.cancelAndHoldAtTime(tTime);
    }
}