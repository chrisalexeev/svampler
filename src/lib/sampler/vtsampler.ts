// import { AdvancedReverb } from "./reverb";

export class EventProcessor {
    private subscriberMap: Record<string, (() => void)[]> = {};

    dispatchEvent(event?: string) {
        event && this.subscriberMap[event]?.forEach((callback) => callback());
    }

    subscribe(topic: string, callback: () => void) {
        if (!this.subscriberMap[topic]) {
            this.subscriberMap[topic] = [];
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
        const response = await fetch(`/samples/${url}`);
        const buffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(buffer);
        this.samples[url] = audioBuffer;
        return audioBuffer;
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

class Sampler {
    library: VTSampleLibrary;
    eventProcessor: EventProcessor;
    samples: Record<string, AudioBuffer | null> = {};
    ctx: AudioContext | null = null;
    bus: AudioNode | null = null;
    // reverb: ConvolverNode | null = null;

    constructor(
        audioContext?: AudioContext,
        library?: VTSampleLibrary,
        eventProcessor?: EventProcessor,
    ) {
        if (audioContext) {
            this.initAudioContext(audioContext);
        }
        this.library = library ?? new VTSampleLibrary();
        this.eventProcessor = eventProcessor ?? new EventProcessor();
    }

    initAudioContext(ctx: AudioContext) {
        this.ctx = ctx;
        this.bus = new MixBus(this.ctx).input;
    }

    async init(eventProcessor: EventProcessor) {
        this.eventProcessor = eventProcessor;
        !this.ctx && this.initAudioContext(new AudioContext());
        const instruments = [
            "kick", "snare", "hihat"
        ]

        instruments.forEach(async (instrument) => {
            await this.loadSample(instrument);
        });

        this.eventProcessor.subscribe("kick", () => this.handleEvent("kick"));
        this.eventProcessor.subscribe("snare", () => this.handleEvent("snare"));
        this.eventProcessor.subscribe("hihat", () => this.handleEvent("hihat"));
    }

    private async loadSample(name: string) {
        const url = Object.keys(this.library.samples).find((key) => key.toLowerCase().includes(name.toLowerCase()));
        if (!url) {
            throw new Error(`Sample ${name} not found in library`);
        }
        const sample = await this.getSampleFromLibrary(url);
        this.samples[name] = sample;
    }

    async getSampleFromLibrary(url: string) {
        return await this.library.loadSample(this.ctx!, url);
    }

    handleEvent(type: string) {
        this.playSample(type);
    }

    playSample(name: string) {
        if (!this.ctx) {
            throw new Error('Audio context not initialized');
        }
        const source = this.ctx.createBufferSource();
        source.buffer = this.samples[name];
        if (!source.buffer) {
            throw new Error(`Sample ${name} not found in sampler`);
        }
        source.connect(this.bus!);
        source.start(this.ctx.currentTime, 0, source.buffer.duration);
        source.onended = () => {
            source.disconnect();
        }
    }
}

export const sampler = new Sampler();