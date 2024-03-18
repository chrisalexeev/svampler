import type { Instrument } from "../instruments";
import { Track } from "./track";

class MixBus {
    private audioContext!: AudioContext;
    private compressor!: DynamicsCompressorNode;
    private gainNode!: GainNode;
    private _tracks = new Array<Track>(8);

    init(context: AudioContext) {
        this.audioContext = context;
        this.compressor = this.createCompressor(this.audioContext);
        for (let i = 0; i < this._tracks.length; i++) {
            this._tracks[i] = new Track(this.audioContext);
            this._tracks[i]!.connect(this.compressor);
        }
        this.compressor.connect(this.audioContext.destination);
    }
    private createCompressor(audioContext: AudioContext) {
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-3, audioContext.currentTime);
        compressor.ratio.setValueAtTime(20, audioContext.currentTime);
        compressor.attack.setValueAtTime(0.01, audioContext.currentTime);
        compressor.release.setValueAtTime(0.01, audioContext.currentTime);
        return compressor;
    }
    get input() {
        return this.gainNode;
    }
    get tracks() {
        return this._tracks;
    }
    connectToTrack(node: AudioNode | Instrument, trackIndex: number) {
        if (trackIndex < 0 || trackIndex > this._tracks.length - 1) {
            throw new Error("Invalid track index");
        }
        node.connect(this._tracks[trackIndex]!.input);
    }
    connectToNewTrack(node: AudioNode | Instrument) {
        const trackIndex = this._tracks.findIndex(track => track.isOpen());
        if (trackIndex === -1) {
            throw new Error("No available tracks");
        }
        node.connect(this._tracks[trackIndex]!.input);
    }
    hasAvailableTrack() {
        return this._tracks.some(track => !track.input);
    }
}

export const mixBus = new MixBus();