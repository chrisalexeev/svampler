export class CustomAudioNode extends AudioWorkletNode {
    /**
     * Initialize the Audio processor by sending the fetched WebAssembly module to
     * the processor worklet.
     *
     * @param {ArrayBuffer} wasmBytes Sequence of bytes representing the entire
     * WASM module that will handle pitch detection.
     */
    init = (wasmBytes: ArrayBuffer) => {
      this.port.onmessage = (event) => this.onmessage(event.data);
  
      this.port.postMessage({
        type: "send-wasm-module",
        wasmBytes,
      });
    }
  
    onprocessorerror = (err: any) => {
        console.log(
            `An error from AudioWorkletProcessor.process() occurred: ${err}`
        );
    };
  
    onmessage = (event: any) => {
      if (event.type === 'wasm-module-loaded') {
        this.port.postMessage({
          type: "init-plugin",
          gain: 10,
        });
      }
    }
  }