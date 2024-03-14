class Arranger {
    arrangements: Arrangement[] = [];
    currentIndex: number = 0;
    _bpm: number = 120;

    addArrangement(arrangement: Arrangement) {
        this.arrangements.push(arrangement);
    }

    nextArrangement() {
        this.currentIndex = (this.currentIndex + 1) % this.arrangements.length;
    }

    prevArrangement() {
        this.currentIndex = (this.currentIndex - 1 + this.arrangements.length) % this.arrangements.length;
    }

    getCurrentArrangement() {
        return this.arrangements[this.currentIndex];
    }

    get bpm() {
        return this._bpm;
    }

    set bpm(value: number) {
        this._bpm = value;
    }
}

export const arragner = new Arranger();