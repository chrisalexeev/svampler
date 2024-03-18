export function createId() {
    let id = Math.round(Math.random() * 100000);
    return id;
}

export function beatsToSeconds(beats: number, bpm: number) {
    return beats * 60 / bpm;
}