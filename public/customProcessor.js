import { Delay } from "./pkg/wasm_int.js";

class CustomProcessor extends AudioWorkletProcessor {
    delay;

    constructor() {
        super();
        this.delay = new Delay(48000);
        // this.port.onmessage = (event) => {
        //     if (event.data.delay)
        //         this.delay = event.data.delay;
        // };
    }

    process(inputs, outputs, parameters) {
        // const channelAverages = [];

        // Calculate average amplitude for each channel
        // for (let channel = 0; channel < inputs[0].length; channel++) {
        //     let totalAmplitude = 0;
        //     const inputChannel = inputs[0][channel];

        //     for (let sample = 0; sample < inputChannel.length; sample++) {
        //         totalAmplitude += Math.abs(inputChannel[sample]);
        //     }

        //     const averageAmplitude = totalAmplitude / inputChannel.length;
        //     channelAverages.push(averageAmplitude);
        // }

        for (let channel = 0; channel < Math.min(inputs[0].length, outputs[0].length); channel++) {
            for (let sample = 0; sample < Math.min(inputs[0][channel].length, outputs[0][channel].length); sample++) {
                outputs[0][channel][sample] = this.delay.process(inputs[0][channel][sample]);
            }
        }

        // if (channelAverages.some((value) => !!value))
        //     this.port.postMessage(channelAverages);

        return true;
    }
}

registerProcessor('custom-processor', CustomProcessor);
