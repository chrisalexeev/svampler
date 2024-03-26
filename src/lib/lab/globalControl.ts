import { BPM_CHANGE } from "$lib/constants/topics";
import { eventProcessor } from ".";

class GlobalControl {
    private _bpm: number = 120;
    private _ctx!: AudioContext;
    private _time: number = 0;

    get ctx() {
        return this._ctx;
    }

    set ctx(value: AudioContext) {
        this._ctx = value;
    }

    get bpm() {
        return this._bpm;
    }

    set bpm(value: number) {
        if (value < 40 || value > 240) throw new Error("Invalid BPM");
        this._bpm = value;
        eventProcessor.dispatchEvent(BPM_CHANGE, value);
    }

    get time() {
        return this._time;
    }

    set time(value: number) {
        this._time = value;
    }

    get secondsPerBeat() {
        return 60 / this.bpm;
    }

    get secondsPerMeasure() {
        return 60 / this.bpm * 4;
    }
}

export const globalControl = new GlobalControl();