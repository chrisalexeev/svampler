export class Synth {
    context: AudioContext;
    
    output: AudioNode;

    constructor(context: AudioContext) {
        this.context = context;

        const gainNode = this.context.createGain();
        const compressor = this.context.createDynamicsCompressor();
        gainNode.connect(compressor);
        gainNode.gain.value = 0.5;
        this.output = gainNode;
        this.output.connect(this.context.destination);
    }

    play() {
        const osc = this.context!.createOscillator();
        osc.connect(this.output);
        osc.start();
        osc.stop(this.context!.currentTime + 0.5);
    }
}