// import { AdvancedReverb } from "./reverb";

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
    samples: Record<string, AudioBuffer | null> = {};

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
            const response = await fetch(`/samples/${url}`);
            const buffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(buffer);
            this.samples[url] = audioBuffer;
            return audioBuffer;
        } catch (e) {
            throw new Error(`Failed to load sample ${url}: ${e}`);
        }
    }

    async previewSample(ctx: AudioContext, url: string) {
        const sample = await this.loadSample(ctx, url);
        const source = ctx.createBufferSource();
        source.buffer = sample;
        source.connect(ctx.destination);
        source.start(ctx.currentTime, 0, sample!.duration);
        source.onended = () => {
            source.disconnect();
        }
    }
}

class MixBus {
    private compressor: DynamicsCompressorNode;
    private gainNode: GainNode;
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
        this.gainNode.connect(this.compressor);
        this.compressor.connect(audioContext.destination);
    }
    get input() {
        return this.gainNode;
    }
}

// interface Sample {
//     name: string;
//     buffer: AudioBuffer;
// }

class Sampler {
    library: VTSampleLibrary;
    readonly maxSamples = 8;

    private eventProcessor: EventProcessor;
    private samples: Record<string, AudioBuffer | null> = {};
    private ctx: AudioContext | null = null;
    private bus: AudioNode | null = null;
    // reverb: ConvolverNode | null = null;

    constructor(
        eventProcessor: EventProcessor,
        library: VTSampleLibrary,
    ) {
        this.eventProcessor = eventProcessor;
        this.library = library;
    }

    initAudio(ctx: AudioContext) {
        this.ctx = ctx;
        this.bus = new MixBus(this.ctx).input;
    }

    init() {
        this.initAudio(new AudioContext());
    }

    async loadSample(slot: number, url: string) {
        const sample = await this.getSampleFromLibrary(url);
        if (!sample) return false;
        this.samples[slot] = sample;
        this.eventProcessor.subscribe(slot, this.handleEvent.bind(this));
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
        const source = this.ctx.createBufferSource();
        source.buffer = this.samples[slot];
        if (!source.buffer) {
            throw new Error(`Sample ${name} not found in sampler`);
        }
        source.connect(this.bus!);
        source.start(this.ctx.currentTime, 0, source.buffer.duration);
        source.onended = () => {
            source.disconnect();
        }
    }
    
    get context() {
        return this.ctx;
    }
}

export const library = new VTSampleLibrary();
export const eventProcessor = new EventProcessor();
export const sampler = new Sampler(eventProcessor, library);