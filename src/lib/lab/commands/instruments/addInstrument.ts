import { REFRESH_BANK } from "$lib/constants/topics";
import { eventProcessor } from "$lib/lab";
import type { Instrument } from "$lib/lab/instruments";
import type { InstConstructor } from "$lib/lab/instruments/instrument";
import type { InstrumentBank } from "$lib/lab/instruments/instrumentBank";
import type { Command } from "../command";

export class AddInstrumentCommand<T extends Instrument> implements Command {
    private instConstructor: InstConstructor<T>;
    private instrument: T | undefined;
    private instrumentBank: InstrumentBank;

    constructor(instrumentBank: InstrumentBank, instrument: InstConstructor<T>) {
        this.instConstructor = instrument
        this.instrumentBank = instrumentBank;
    }

    execute() {
        this.instrumentBank.addInstrument(this.instConstructor);
        eventProcessor.dispatchEvent(REFRESH_BANK);
    }

    undo() {
        this.instrumentBank.removeInstrument(this.instrument!.id);
        eventProcessor.dispatchEvent(REFRESH_BANK);
    }

    getInstrumentId(): number | undefined {
        return this.instrument?.id;
    }
}