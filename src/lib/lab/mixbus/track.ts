export class Track {
    context: any;
    private _node: any;
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
}