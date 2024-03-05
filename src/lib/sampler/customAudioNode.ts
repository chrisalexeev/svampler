import { Delay } from "wasm-int";

export class CustomAudioNode extends AudioWorkletNode {
    // delay: Delay;
    constructor(context: AudioContext, delaySize: number, options: AudioWorkletNodeOptions) {
        super(context, 'custom-processor', options);
        // debugger;
        // this.delay = new Delay(delaySize);
        // this.port.onmessage = (event) => {
        //     const processed = this.delay.process(event.data);
        //     this.port.postMessage({processed});
        // }
        // // this.port.postMessage({delay: this.delay});
    }
}