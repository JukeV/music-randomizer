import { NoteRandomizerBaseClass } from './NoteRandomizerBaseClass';
import { MusicKey } from './MusicKey';
import { Note } from './Note';
import { Chord } from './Chord';
import { MusicUtils } from './MusicUtils';
import { Utils } from './utils';
import { ChordContainer } from './ChordContainer';
import { NoteChar } from '../enums/NoteChar';

import * as math from 'mathjs';

export class MelodyRandomizer extends NoteRandomizerBaseClass {

    key = new MusicKey();

    values: number[] = [];
    weights: number[] = [];

    constructor() {

        super();

        this.PrepareIntervalWeights();

    }

    SetKey(value = new MusicKey()): void {
        this.key = value;
    }

    GetKey(): MusicKey {
        return this.key;
    }

    Create(): void {

        this.CreateNoteDurationList();
        let barRemaining: math.Fraction = this.timeSignature.GetFraction();
        let noteDuration = this.GetNextNoteDuration(barRemaining);

        this.chords = [];
        this.chordContainer = new ChordContainer();

        const totalDuration = this.GetTotalDuration();

        let currentDuration = math.fraction(0);

        let maxStartOctave = this.maxNote.GetOctave();
        let minStartOctave = this.minNote.GetOctave();

        if (MusicUtils.CompareNotes(new Note(this.key.GetRootNote().GetNote(), this.maxNote.GetOctave()), this.maxNote) === 1){
            maxStartOctave--;
        } else if (MusicUtils.CompareNotes(new Note(this.key.GetRootNote().GetNote(), this.minNote.GetOctave()), this.minNote) === -1) {
            minStartOctave++;
        }
        
        let rootOctave = Utils.GetRandomInt(minStartOctave, maxStartOctave);

        let previousNote = new Note(this.key.GetRootNote().GetNote(), rootOctave, noteDuration);

        let twoBeforeNote = new Note(this.key.GetRootNote().GetNote(), rootOctave, noteDuration);
        
        this.chords.push(new Chord([previousNote], previousNote.GetDuration()));      
        
        barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;
        if(math.equal(barRemaining, math.fraction(0))) {
            barRemaining = this.timeSignature.GetFraction();
        }
        noteDuration = this.GetNextNoteDuration(barRemaining);

        currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);

        while (math.smaller(currentDuration, totalDuration)) {

            const newNote = this.GetNextNote(previousNote, this.minNote, this.maxNote);
            newNote.SetDuration(noteDuration);

            twoBeforeNote = previousNote;

            previousNote = newNote;            

            this.chords.push(new Chord([newNote], newNote.GetDuration()));

            currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);

            barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;
            if(math.equal(barRemaining, math.fraction(0))) {
                barRemaining = this.timeSignature.GetFraction();
            }
            noteDuration = this.GetNextNoteDuration(barRemaining);
        }

        const lastNote = this.GetEndNote(twoBeforeNote, this.key.GetRootNote(), previousNote.GetDuration() as math.Fraction, this.minNote, this.maxNote );

        this.chords[this.chords.length - 1] = new Chord([lastNote], lastNote.GetDuration());

        this.chordContainer.SetChords(this.chords);
        this.chordContainer.SetTimeSignature(this.timeSignature);
    }
/*

    Create(): void {

        this.CreateNoteDurationList();
        let barRemaining: math.Fraction = this.timeSignature.GetFraction();
        let noteDuration = this.GetNextNoteDuration(barRemaining);

        this.chords = [];
        this.chordContainer = new ChordContainer();

        const totalDuration = this.GetTotalDuration();

        let currentDuration = math.fraction(0);

        let maxStartOctave = this.maxNote.GetOctave();
        let minStartOctave = this.minNote.GetOctave();

        if (MusicUtils.CompareNotes(new Note(this.key.GetRootNote().GetNote(), this.maxNote.GetOctave()), this.maxNote) === 1){
            maxStartOctave--;
        } else if (MusicUtils.CompareNotes(new Note(this.key.GetRootNote().GetNote(), this.minNote.GetOctave()), this.minNote) === -1) {
            minStartOctave++;
        }
        
        let rootOctave = Utils.GetRandomInt(minStartOctave, maxStartOctave);

        let previousNote = new Note(this.key.GetRootNote().GetNote(), rootOctave);

        let twoBeforeNote = new Note(this.key.GetRootNote().GetNote(), rootOctave);
        
        this.chords.push(new Chord([previousNote], previousNote.GetDuration()));        

        currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);

        while (math.smaller(currentDuration, totalDuration)) {

            const newNote = this.GetNextNote(previousNote, this.minNote, this.maxNote);

            twoBeforeNote = previousNote;

            previousNote = newNote;            

            this.chords.push(new Chord([newNote], newNote.GetDuration()));

            currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);
        }

        const lastNote = this.GetEndNote(twoBeforeNote, this.key.GetRootNote(), math.fraction(1, 4) as math.Fraction, this.minNote, this.maxNote );

        this.chords[this.chords.length - 1] = new Chord([lastNote], lastNote.GetDuration());

        this.chordContainer.SetChords(this.chords);
        this.chordContainer.SetTimeSignature(this.timeSignature);
    }
*/

/*
    GetNextNoteDuration(): math.Fraction {


        return Utils.GetRandomItemFromArray(this.noteDurationList);
    }
*/
    GetEndNote(prevNote: Note, rootNote: Note, duration: math.Fraction, minNote: Note, maxNote: Note): Note {

        const newNote = new Note(rootNote.GetNote(), prevNote.GetOctave(), duration);

        if( MusicUtils.CompareNotes(minNote, newNote) === 1 ) {
            newNote.SetOctave(newNote.GetOctave() + 1);                
        }
        else if (MusicUtils.CompareNotes(maxNote, newNote ) === -1) {
            newNote.SetOctave(newNote.GetOctave() - 1);                
        }

        return newNote;
    }

    PrepareIntervalWeights(): void {
        this.values = [];
        this.weights = [];

        this.values[0] = -7;
        this.weights[0] = 4;

        this.values[1] = -6;
        this.weights[1] = 1;

        this.values[2] = -5;
        this.weights[2] = 2;

        this.values[3] = -4;
        this.weights[3] = 3;

        this.values[4] = -3;
        this.weights[4] = 4;

        this.values[5] = -2;
        this.weights[5] = 5;

        this.values[6] = -1;
        this.weights[6] = 6;

        this.values[7] = 0;
        this.weights[7] = 2;

        this.values[8] = 1;
        this.weights[8] = 6;

        this.values[9] = 2;
        this.weights[9] = 5;

        this.values[10] = 3;
        this.weights[10] = 4;

        this.values[11] = 4;
        this.weights[11] = 3;

        this.values[12] = 5;
        this.weights[12] = 2;

        this.values[13] = 6;
        this.weights[13] = 1;

        this.values[14] = 7;
        this.weights[14] = 4;
    }

    GetNextNote(prevNote = new Note(), minNote = new Note(), maxNote = new Note()): Note {

        const interval = Utils.RandomWeightedValue(this.values, this.weights);

        let noteIndex = NoteChar.values().indexOf(prevNote.GetNote());

        let octave = prevNote.GetOctave();

        noteIndex += interval;

        while (noteIndex < 0) {
            noteIndex += NoteChar.values().length;
            octave--;
        }

        while (noteIndex > NoteChar.values().length) {
            noteIndex -= NoteChar.values().length;
            octave++;
        }

        let newNote = new Note(NoteChar.values()[noteIndex] as NoteChar, octave, prevNote.GetDuration() as math.Fraction);

        while(MusicUtils.CompareNotes(minNote, newNote) === 1 || MusicUtils.CompareNotes(maxNote, newNote) === -1){
            if (MusicUtils.CompareNotes(minNote, newNote) === 1) {
                const distance = MusicUtils.GetNoteScaleDistance(minNote, newNote);
    
                newNote = MusicUtils.TransposeNote(newNote, distance * 2);
            } else if (MusicUtils.CompareNotes(maxNote, newNote) === -1) {
                const distance = MusicUtils.GetNoteScaleDistance(newNote, maxNote);
    
                newNote = MusicUtils.TransposeNote(newNote, distance * -2);
            }    
        }
        /*
        if (MusicUtils.CompareNotes(minNote, newNote) === 1) {
            const distance = MusicUtils.GetNoteScaleDistance(minNote, newNote);

            newNote = MusicUtils.TransposeNote(newNote, distance * 2);
        } else if (MusicUtils.CompareNotes(maxNote, newNote) === -1) {
            const distance = MusicUtils.GetNoteScaleDistance(newNote, maxNote);

            newNote = MusicUtils.TransposeNote(newNote, distance * -2);
        }
        */

        return newNote;
    }
}
