import type { Command } from "../command";
import type { Arranger } from "../../arranger";
import type { Arrangement } from "$lib/lab/arranger";
import { eventProcessor } from "$lib/lab";
import { REFRESH_ARRANGER } from "$lib/constants/topics";

export class AddArrangementCommand implements Command {
    private arranger: Arranger;
    private arragnement: Arrangement;

    constructor(arranger: Arranger, arrangment: Arrangement) {
        this.arranger = arranger;
        this.arragnement = arrangment;
    }

    execute() {
        this.arranger.addArrangement(this.arragnement);
        eventProcessor.dispatchEvent(REFRESH_ARRANGER);
    }

    undo() {
        this.arranger.addArrangement(this.arragnement);
        eventProcessor.dispatchEvent(REFRESH_ARRANGER);
    }
}