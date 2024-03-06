import { CustomAudioNode } from "./customAudioNode";

export class EventProcessor {
    private subscriberMap: Record<string | number, ((topic: string | number) => void)[]> = {};

    dispatchEvent(topic: string | number) {
        this.subscriberMap[topic!] && this.subscriberMap[topic!]?.forEach((callback) => callback(topic));
    }

    subscribe(topic: string | number, callback: (topic: string | number) => void) {
        if (!this.subscriberMap[topic]) {
            this.subscriberMap[topic] = [];
        }
        if (this.subscriberMap[topic].map((cb) => cb.name).includes(callback.name)) {
            return;
        }
        this.subscriberMap[topic].push(callback);
    }
}

class VTSampleLibrary {
    samples: Record<string, Sample | null> = {};

    constructor() {
        this.samples = {};
        this.loadSampleList();
    }
    async loadSampleList() {
        const samples: string[] = (await (await fetch('/environment.json')).json()).samples;
        for (const sample of samples) {
            this.samples[sample] = null;
        }
    }
    async loadSample(ctx: AudioContext, url: string) {
        if (this.samples[url]) {
            return this.samples[url];
        }
        try {
            const sample = await (new Sample(ctx).load(`/samples/${url}`));
            this.samples[url] = sample;
            return sample;
        } catch (e) {
            throw new Error(`Failed to load sample ${url}: ${e}`);
        }
    }

    async previewSample(ctx: AudioContext, url: string) {
        const sample = await this.loadSample(ctx, url);
        if (!sample) return;
        if (!sample.sampleBuffer) return;
        sample.output.connect(ctx.destination);
        sample.play();
    }
}

class MixBus {
    private compressor: DynamicsCompressorNode;
    private gainNode: GainNode;
    private customWorklet: CustomAudioNode | undefined;

    constructor(audioContext: AudioContext) {
        this.gainNode = audioContext.createGain();
        // const reverb = new AdvancedReverb(audioContext);
        // reverb.decayTime = 0.2;
        // this.gainNode.connect(reverb.input);
        this.compressor = audioContext.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-3, audioContext.currentTime);
        this.compressor.ratio.setValueAtTime(20, audioContext.currentTime);
        this.compressor.attack.setValueAtTime(0.01, audioContext.currentTime);
        this.compressor.release.setValueAtTime(0.01, audioContext.currentTime);
        // reverb.connect(this.compressor);
        // this.gainNode.connect(this.compressor);
        audioContext.audioWorklet.addModule('/customProcessor.js').then(() => {
            this.customWorklet = new CustomAudioNode(audioContext, 'custom-processor');
            fetch('/wasm_int_bg.wasm').then((response) => response.arrayBuffer()).then((wasmBytes) => {
                this.customWorklet!.init(wasmBytes);
            });
            const splitterNode = audioContext.createChannelSplitter(2);
            const mergerNode = audioContext.createChannelMerger(2);
            this.gainNode.connect(splitterNode);
            splitterNode.connect(this.customWorklet, 0, 0);
            splitterNode.connect(this.compressor, 0, 0);
            this.customWorklet.connect(mergerNode, 0, 0);
            this.compressor.connect(mergerNode, 0, 1);
            mergerNode.connect(audioContext.destination);
            // this.compressor.connect(audioContext.destination);
        })
            .catch((e) => {
                console.error(e);
                this.compressor.connect(audioContext.destination);
            });
    }
    get input() {
        return this.gainNode;
    }

    destroy() {
        // this.customWorklet?.destroy();
    }
}

class Sample {
    context: AudioContext;
    sampleBuffer: AudioBuffer | null;
    loaded: boolean;
    output: GainNode;

    constructor(context: AudioContext) {
        this.context = context;
        this.sampleBuffer = null;
        this.loaded = false;
        this.output = this.context.createGain();
        this.output.gain.value = 1;
    }

    play() {
        if (!this.loaded) return;
        const buffer = this.context.createBufferSource();
        buffer.buffer = this.sampleBuffer;
        buffer.connect(this.output);
        buffer.start(this.context.currentTime, 0, this.sampleBuffer!.duration);
        buffer.onended = () => {
            buffer!.disconnect();
        }
    }

    connect(input: DynamicsCompressorNode) {
        this.output.connect(input);
    }

    set gain(value: number) {
        this.output.gain.value = value;
    }

    async load(path: RequestInfo | URL) {
        this.loaded = false;
        const response = await fetch(path);
        const blob = await response.arrayBuffer();
        const buffer = await this.context.decodeAudioData(blob);
        this.sampleBuffer = buffer;
        this.loaded = true;
        return this;
    }
}

class Sampler {
    library: VTSampleLibrary;
    samples: Record<string, Sample | null> = {};

    readonly maxSamples = 8;

    private eventProcessor: EventProcessor;
    private ctx: AudioContext | null = null;
    private bus: MixBus | null = null;

    constructor(
        eventProcessor: EventProcessor,
        library: VTSampleLibrary,
    ) {
        this.eventProcessor = eventProcessor;
        this.library = library;
    }

    initAudio(ctx: AudioContext) {
        this.ctx = ctx;
        this.bus = new MixBus(this.ctx);
    }

    init() {
        this.initAudio(new AudioContext());
    }

    async loadSample(slot: number, url: string) {
        const sample = await this.getSampleFromLibrary(url);
        if (!sample) return false;
        this.samples[slot] = sample;
        this.eventProcessor.subscribe(slot, this.handleEvent.bind(this));
        this.eventProcessor.dispatchEvent(`sample-loaded-${slot}`);
        return true;
    }

    async getSampleFromLibrary(url: string) {
        return await this.library.loadSample(this.ctx!, url);
    }

    handleEvent(type: string | number) {
        Number.isInteger(type) && this.playSample(type as number);
    }

    playSample(slot: number) {
        if (!this.ctx) {
            throw new Error('Audio context not initialized');
        }
        const source = this.samples[slot];
        if (!source) return;
        source.output.connect(this.bus!.input);
        source.play();
    }

    get context() {
        return this.ctx;
    }

    destroy() {
        this.ctx?.close();
        this.bus?.destroy();
    }
}

export const keyMap = {
    0: "a",
    1: "s",
    2: "d",
    3: "w",
    4: "j",
    5: "k",
    6: "l",
    7: "i",
} as Record<number, string>;
export const library = new VTSampleLibrary();
export const eventProcessor = new EventProcessor();
export const sampler = new Sampler(eventProcessor, library);