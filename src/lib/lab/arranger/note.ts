import { createId } from "../util";

export class Note {
    private static ids = new Set<number>();
    value: number;
    start: number;
    end: number;
    velocity: number;
    _offest: number = 0;
    readonly id: number;

    constructor(value: number, start: number, end: number, velocity: number) {
        this.start = start;
        this.end = end;
        this.value = value;
        this.velocity = velocity;
        this.id = this.createId();
    }

    get offset() {
        return this._offest;
    }
    
    set offset(value: number) {
        this._offest = value;
    }

    get duration() {
        return this.end - this.start;
    }

    private createId() {
        let id = createId();
        while (Note.ids.has(id)) {
            id = createId();
        }
        Note.ids.add(id);
        return id;
    }
}