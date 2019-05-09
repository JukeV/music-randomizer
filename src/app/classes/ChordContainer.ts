import { TimeSignature } from './TimeSignature';
import { MusicUtils } from './MusicUtils';

import * as math from 'mathjs';
import { Chord } from './Chord';

import { ClefType } from '../enums/ClefType';

export class ChordContainer {

    chords: Chord[] = [];
    timeSignature = new TimeSignature(4, 4);
    clef: ClefType = ClefType.Treble;

    constructor() {
    }

    SetTimeSignature(signature = new TimeSignature(4, 4)) {
        this.timeSignature = signature;
    }

    GetTimeSignature() {
        return this.timeSignature;
    }

    SetChords(notes: Chord[]) {
        this.chords = notes;
    }

    GetChords() {
        return this.chords;
    }

    SetClefType(value: ClefType){
        this.clef = value;
    }

    GetClefType(): ClefType{
        return this.clef;
    }

    PullChordSet(): Chord[] {
        const returnNotes = [];

        while (
            math.compare(MusicUtils.CalculateMusicTotalDuration(returnNotes), math.fraction(this.timeSignature.GetTimeSignature())) == -1) {
            if (this.chords.length <= 0) {
                break;
            }

            returnNotes.push(this.chords.shift());
        }

        return returnNotes;
    }
}
