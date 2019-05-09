import { MusicUtils } from './musicutils';

import * as math from 'mathjs';

export class NoteData {
    note = 'C';
    octave = 4;
    durationSymbol = 'q';

    constructor(note = 'C', octave = 4, durationSymbol = 'q') {
        this.note = note;
        this.octave = octave;
        this.durationSymbol = durationSymbol;
    }

    SetDurationSymbol(value = 'q') {
        this.durationSymbol = value;
    }

    GetDurationSymbol() {
        return this.durationSymbol;
    }

    SetDurationFraction(value = math.fraction('1/4')) {
        this.durationSymbol = MusicUtils.DenominatorToNoteDurationCode((value as math.Fraction).d);
    }

    GetDurationFraction() {
        return MusicUtils.NoteDurationCodeToFraction(this.durationSymbol);
    }

    SetOctave(value = 4) {
        this.octave = value;
    }

    GetOctave() {
        return this.octave;
    }

    SetNote(value = 'C') {
        this.note = value;
    }

    GetNote() {
        return this.note;
    }

    GetKeyString() {
        return this.note + '/' + this.octave.toString();
    }
}
