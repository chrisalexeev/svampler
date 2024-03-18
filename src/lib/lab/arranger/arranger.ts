import type { Arrangement } from "./arrangement";

class Arranger {
    arrangements: Arrangement[] = [];
    currentIndex: number = 0;

    addArrangement(arrangement: Arrangement) {
        this.arrangements.push(arrangement);
    }

    play() {
        console.log("playing")
        this.arrangements[this.currentIndex].play();
    }

    stop() {
        this.arrangements[this.currentIndex].stop();
    }
}

export type { Arranger };
export const arranger = new Arranger();