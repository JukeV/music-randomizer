import { Note } from './Note';
import { MusicUtils } from './MusicUtils';

import * as math from 'mathjs';


export class Chord {
    notes: Note[] = [];
    duration = math.fraction(1, 4);
    tieForward: boolean = false;
    tieBackward: boolean = false;    

    constructor(notes: Note[] = [], duration = math.fraction(1, 4)){
        this.notes = notes;
        this.duration = duration;
    }

    SetNotes(values: Note[]): void {
        this.notes = values;
    }

    AddNote(value: Note): void {        
        if(!this.notes.some(note => Note.Comparer(note, value))){
            this.notes.push(value);
        }
    }

    GetNotes(): Note[] {
        return this.notes;
    }

    SetTieForward(value: boolean): void {
        this.tieForward = value;
    }

    GetTieForward(): boolean {
        return this.tieForward;
    }

    SetTieBackward(value: boolean): void {
        this.tieBackward = value;
    }

    GetTieBackward(): boolean {
        return this.tieBackward;
    }

    SetDuration(value: math.Fraction) {
        this.duration = value;
    }

    GetDuration() {
        return this.duration;
    }

    GetDurationSymbol(): string {
        return MusicUtils.DenominatorToNoteDurationCode((this.duration as math.Fraction).d);
    }

    GetMaxNote(): Note{
        let note = this.notes[0];
        for(let i = 1; i < this.notes.length; i++){
            if(MusicUtils.CompareNotes(this.notes[i], note) === 1){
                note = this.notes[i]
            }
        }

        return note;
    }

    GetMinNote(): Note{
        let note = this.notes[0];
        for(let i = 1; i < this.notes.length; i++){
            if(MusicUtils.CompareNotes(this.notes[i], note) === -1){
                note = this.notes[i]
            }
        }

        return note;
    }

    GetNoteSymbols(): string[] {

        const noteStrings: string[] = [];

        this.notes.forEach( note => {
            noteStrings.push(note.GetNoteSymbol());
        });

        return noteStrings;
    }

    

}