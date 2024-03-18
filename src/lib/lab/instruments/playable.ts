export interface Playable {
    triggerNoteOn(note: number, velocity?: number, time?: number): void;
    triggerNoteOff(note: number, time?: number): void;
}