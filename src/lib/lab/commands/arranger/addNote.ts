import type { Command } from "../command";
import type { Arrangement } from "../../arranger/arrangement";
import type { Note } from "$lib/lab/arranger/note";
import { eventProcessor } from "$lib/lab";
import { REFRESH_NOTES } from "$lib/constants/topics";

export class AddNoteCommand implements Command {
    private arrangement: Arrangement;
    private note: Note;

    constructor(arrangement: Arrangement, note: Note) {
        this.arrangement = arrangement;
        this.note = note;
    }

    execute() {
        this.arrangement.addNote(this.note);
        eventProcessor.dispatchEvent(REFRESH_NOTES, this.arrangement.id);
    }

    undo() {
        this.arrangement.removeNote(this.note);
        eventProcessor.dispatchEvent(REFRESH_NOTES, this.arrangement.id);
    }
}