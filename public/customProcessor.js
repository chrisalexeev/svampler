import "./TextEncoder.js";
import init, { MyPlugin } from './wasm_int.js';

class CustomProcessor extends AudioWorkletProcessor {
    plugin;

    constructor() {
        super();
        this.plugin = null;
        this.port.onmessage = this.onmessage.bind(this);
    }

    onmessage(event) {
        if (event.data.type === "send-wasm-module") {
            init(WebAssembly.compile(event.data.wasmBytes)).then(() => {
                this.port.postMessage({ type: 'wasm-module-loaded' });
            });
        } else if (event.data.type === 'init-plugin') {
            const { gain } = event.data;
            this.plugin = new MyPlugin(gain);
            console.log('Plugin initialized');
        }
    };

    process(inputs, outputs, parameters) {

        if (this.plugin) {
            for (let channel = 0; channel < inputs[0].length; ++channel) {
                const input = inputs[0][channel];
                const output = outputs[0][channel];
                if (!input || !output) {
                    continue;
                }
                this.plugin.process(input, output);
            }
        }

        return true;
    }
}

registerProcessor('custom-processor', CustomProcessor);
