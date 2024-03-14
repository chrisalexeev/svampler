export class Bar {
    notes: Set<Note> = new Set();

    addNote(note: Note) {
        this.notes.add(note);
    }

    removeNote(note: Note) {
        this.notes.delete(note);
    }


}