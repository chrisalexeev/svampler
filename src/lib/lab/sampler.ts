import { EventProcessor } from "./eventProcessor";

class VTSampleLibrary {
    urlPrefix: string | undefined;
    samples: Record<string, Sample | null> = {};

    constructor() {
        this.samples = {};
        this.loadSampleList();
    }
    async loadSampleList() {
        const environment = await (await fetch('/environment.json')).json();
        const samples: string[] = environment.samples;
        if (environment.urlPrefix) {
            this.urlPrefix = environment.urlPrefix;
        }
        for (const sample of samples) {
            this.samples[sample] = null;
        }
    }
    async loadSample(ctx: AudioContext, url: string) {
        if (this.samples[url]) {
            return this.samples[url];
        }
        try {
            const isProd = import.meta.env.PROD;
            const sample = await (new Sample(ctx).load(`${(isProd && this.urlPrefix) || ""}/samples/${url}`));
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

export class Sampler {
    library: VTSampleLibrary;
    samples: Record<string, Sample | null> = {};
    output!: GainNode;

    readonly maxSamples = 8;

    private eventProcessor: EventProcessor;
    private ctx: AudioContext | null = null;

    constructor(
        eventProcessor: EventProcessor,
        library: VTSampleLibrary,
    ) {
        this.eventProcessor = eventProcessor;
        this.library = library;
    }

    initAudio(ctx: AudioContext) {
        this.ctx = ctx;
        this.output = ctx.createGain();
    }

    init(ctx?: AudioContext) {
        this.initAudio(ctx ?? new AudioContext());
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
        source.output.connect(this.output);
        source.play();
    }

    get context() {
        return this.ctx;
    }

    close() {
        this.ctx?.close();
    }

    connect(destination: AudioNode) {
        this.output.connect(destination);
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