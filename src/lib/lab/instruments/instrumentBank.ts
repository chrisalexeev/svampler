import type { Instrument } from ".";
import { mixBus } from "..";

class InstrumentBank {
    private static counter = 0;
    private instruments: Instrument[] = [];
    private ctx!: AudioContext;

    init(ctx: AudioContext) {
        this.ctx = ctx;
    }

    public addInstrument<T extends Instrument>(type: new (ctx: AudioContext, name: string) => T): T {
        const inst = new type(this.ctx, `${type.name}-${InstrumentBank.counter++}`) as T;
        this.instruments.push(inst);
        try {
            mixBus.connectToNewTrack(inst);
        } catch (e) {
            console.error(e);
        }
        return inst;
    }

    public removeInstrument(id: number) {
        this.instruments = this.instruments.filter((instrument) => instrument.id !== id);
    }

    public getInstrument(name: string): Instrument | undefined {
        return this.instruments.find((instrument) => instrument.name === name);
    }

    public getInstruments(): Instrument[] {
        return this.instruments;
    }
}

export type { InstrumentBank };
export const instrumentBank = new InstrumentBank();