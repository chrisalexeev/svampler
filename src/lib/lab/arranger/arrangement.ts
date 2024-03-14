import { Bar } from "./bar";

export class Arrangement {
    bars: Bar[] = [];

    constructor(bars: number) {
        for (let i = 0; i < bars; i++) {
            this.bars.push(new Bar());
        }
    }

    addBar() {
        this.bars.push(new Bar());
    }

    removeBar() {
        this.bars.pop();
    }
}