export function midiToHz(midiNote: number): number {
    const a = 440; // Frequency of A4 (MIDI note 69)
    return a * Math.pow(2, (midiNote - 69) / 12);
}