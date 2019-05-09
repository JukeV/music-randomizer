import { NoteChar } from '../enums/NoteChar';

import * as math from 'mathjs';

export class Note {
    note = NoteChar.C;
    sharpsFlats = 0; // how many sharsp or flats -2: bb, 2: ## e.g...
    octave = 4;
    duration = math.fraction(1, 4);

    constructor(note: NoteChar = NoteChar.C, octave: number = 4, duration: math.Fraction = math.fraction(1, 4) as math.Fraction) {
        this.note = note;
        this.octave = octave;
        this.duration = duration;
    }

    SetDuration(value: math.Fraction) {
        this.duration = value;
    }

    GetDuration() {
        return this.duration;
    }

    SetOctave(value: number) {
        this.octave = value;
    }

    GetOctave() {
        return this.octave;
    }

    SetNote(value: NoteChar) {
        this.note = value;
    }

    GetNote() {
        return this.note;
    }

    SetSharpsFlats(value: number): void {
        this.sharpsFlats = value;
    }

    GetSharpsFlats(): number{
        return this.sharpsFlats;
    }

    GetNoteSymbol(): string {
        let symbol: string = this.note;

        if(this.sharpsFlats > 0){
            symbol += this.GetSharpCharacters(this.sharpsFlats);
        }
        else if (this.sharpsFlats < 0) {
            let modifier = -this.sharpsFlats;
            symbol += this.GetFlatCharacters(modifier);
        }

        return symbol + '/' + this.octave.toString();
    }

    private GetSharpCharacters(count: number): string{
        let characters: string = '';

        for(let i = 0; i < count; i++){
            characters += '#';
        }

        return characters;
    }

    private GetFlatCharacters(count: number): string{
        let characters: string = '';

        for(let i = 0; i < count; i++){
            characters += 'b';
        }

        return characters;
    }

    static Comparer(note1: Note, note2: Note){
        return note1.GetDuration() === note2.GetDuration() && note1.GetNote() === note2.GetNote() && note1.GetOctave() === note2.GetOctave() && note1.GetSharpsFlats() === note1.GetSharpsFlats();
    }
    
}
