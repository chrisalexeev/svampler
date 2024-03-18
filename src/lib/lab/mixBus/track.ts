import type { Instrument } from "../instruments";

export class Track {
    context: any;
    private _node: GainNode;
    private _connections: Instrument[] = [];
    gain: number;
    constructor(context: any, gain = 1) {
        this.context = context;
        this.gain = gain;
        this._node = this.context.createGain();
        this._node.gain.value = this.gain;
    }
    get input() {
        return this._node;
    }
    connect(destination: any) {
        this._node.connect(destination);
    }
    disconnect() {
        this._node.disconnect();
    }
    setGain(value: number) {
        this._node.gain.value = value;
    }
    isOpen() {
        return this._connections.length === 0;
    }
    connectInstrument(instrument: Instrument) {
        instrument.connect(this._node);
        this._connections.push(instrument);
    }
    disconnectInstrument(instrument: Instrument) {
        instrument.disconnect();
        this._connections = this._connections.filter((conn) => conn.id !== instrument.id);
    }
}