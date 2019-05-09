import { TimeSignature } from './TimeSignature';
import { ChordContainer } from './ChordContainer';
import { ClefType } from '../enums/ClefType';

import * as math from 'mathjs';
import { Note } from './Note';
import { Chord } from './Chord';
import { Utils } from './Utils';
export class NoteRandomizerBaseClass {

    minNoteDuration: math.Fraction = math.fraction(1, 4) as math.Fraction;
    maxNoteDuration: math.Fraction = math.fraction(1, 4) as math.Fraction;
    noteDurationList: math.Fraction[];
    minNote = new Note();
    maxNote = new Note();
    clef = ClefType.Treble;
    timeSignature = new TimeSignature(4, 4);
    chords: Chord[] = [];
    staveAmount = 20;
    inversions = false;
    chordContainer = new ChordContainer();

    constructor() {
    }

    SetNoteRange(minNote = new Note(), maxNote = new Note()): void {
        this.minNote = minNote;
        this.maxNote = maxNote;
    }

    SetNoteLengthLimits(min: math.Fraction, max: math.Fraction): void {
        this.minNoteDuration = min;
        this.maxNoteDuration = max;
    }

    SetMinNoteDuration(value: math.Fraction){
        this.minNoteDuration = value;
    }

    SetMaxNoteDuration(value: math.Fraction){
        this.maxNoteDuration = value;
    }


    SetClef(clef = ClefType.Treble): void {
        this.clef = clef;
    }

    SetTimeSignature(signature = new TimeSignature(4, 4)): void {
        this.timeSignature = signature;
    }

    SetStaveAmount(amount = 20): void {
        this.staveAmount = amount;
    }

    GetChords(): Chord[] {
        return this.chords;
    }

    SetInversions(value = false): void {
        this.inversions = value;
    }

    GetInversions(): boolean {
        return this.inversions;
    }

    GetTotalDuration(): math.Fraction {
        return math.multiply(this.staveAmount, math.fraction(this.timeSignature.GetTimeSignature())) as math.Fraction;
    }

    GetChordContainer(): ChordContainer {
        return this.chordContainer;
    }

    protected GetNextNoteDuration(maxDuration: math.Fraction): math.Fraction {        

        let duration: math.Fraction = Utils.GetRandomItemFromArray(this.noteDurationList);
        
        if(math.larger(duration, math.fraction(1, maxDuration.d))){
            duration = math.fraction(1, maxDuration.d) as math.Fraction;
        }

        return duration;

    }

    protected CreateNoteDurationList(){
        const list: math.Fraction[] = [];

        const minDuration = this.minNoteDuration;

        let currentDuration = math.fraction(minDuration) as math.Fraction; // this.minNoteDuration as math.Fraction;

        while(math.smallerEq( currentDuration, this.maxNoteDuration)) {
            list.push(math.fraction(currentDuration) as math.Fraction );

            currentDuration = math.sum(currentDuration, math.fraction(1, currentDuration.d) as math.Fraction);

            // currentDuration.n = currentDuration.n + 1;
        }

        this.noteDurationList = list;
    }
}
