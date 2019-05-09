import { Note } from './Note';
import { KeyType } from '../enums/KeyType'
import { NoteChar } from '../enums/NoteChar';
import { Utils } from './utils';

import * as math from 'mathjs';

export class Scale { // not in use!

    baseScalePattern: number [] = [2, 2, 1, 2, 2, 2, 1];

    notePattern: number[];

    scalePattern: number[];
    
    notes: Note[];

    rootnote: Note;

    keyType: KeyType;

    constructor(rootNote: Note = new Note(NoteChar.C, 4, math.fraction(1, 4) as math.Fraction), keyType: KeyType = KeyType.Major) {
        this.rootnote = rootNote;
        this.keyType = keyType;
    }

    SetRootNote(value: Note): void {
        this.rootnote = value;
    }

    GetRootNote(): Note {
        return this.rootnote;
    }

    SetKeyType(value: KeyType): void {
        this.keyType = value;
    }

    GetNotes(): Note[] {
        this.PrepareNotes();
        return this.notes;
    }


    private PrepareNotePattern() {
        this.notePattern = Utils.RotateArray(this.baseScalePattern, NoteChar.values().indexOf(this.rootnote.GetNote()));
    }

    private PrepareScalePattern() {
        if(this.keyType === KeyType.Minor) {
            this.scalePattern = Utils.RotateArray(this.baseScalePattern, 5);
        } else {
            this.scalePattern = this.baseScalePattern;
        }
    }

    private PrepareNotes(): void {
        this.PrepareNotePattern();
        this.PrepareScalePattern();
        this.notes = [];
        this.notes.push(this.rootnote);
        for(let i = 1; i < this.scalePattern.length; i++) {
            
            const noteChar = NoteChar.values()[i];

            const newNote = new Note(noteChar as NoteChar, undefined, undefined);            

            const sharpsFlats = this.rootnote.GetSharpsFlats() - this.notePattern[i] + this.scalePattern[i];

            newNote.SetSharpsFlats(sharpsFlats) ;
            this.notes.push(newNote);                        
        }
    }
}
