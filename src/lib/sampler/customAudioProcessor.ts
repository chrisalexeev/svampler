import { Delay } from "wasm-int";

class CustomProcessor extends AudioWorkletProcessor {
    delay;

    constructor() {
        super();
        this.delay = new Delay(48000);
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], _parameters: any) {
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
