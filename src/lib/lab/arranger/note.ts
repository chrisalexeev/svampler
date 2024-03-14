class Note {
    midi: number;
    start: number;
    end: number;
    velocity: number;
    _offest: number = 0;

    constructor(midi: number, start: number, end: number, velocity: number) {
        this.start = start;
        this.end = end;
        this.midi = midi;
        this.velocity = velocity;
    }

    get offset() {
        return this._offest;
    }
    
    set offset(value: number) {
        this._offest = value;
    }
}