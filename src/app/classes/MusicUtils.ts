import { Utils } from './utils';
import { NoteData } from './NoteData';
import { ExtendedNote } from './ExtendedNote';
import { ChordContainer } from './ChordContainer';

import { MelodicChordDirection } from '../enums/MelodicChordDirection';
import { NoteChar } from '../enums/NoteChar';
import { NoteDuration } from '../enums/NoteDuration';
import { KeySignatureCode } from '../enums/KeySignatureCode';
import { Note } from './Note';
import { Chord } from './Chord';
import { ClefType } from '../enums/ClefType';

import * as math from 'mathjs';

export class MusicUtils {

  static NoteDurationCodeToFraction(lengthCode: string): math.Fraction {
    if (lengthCode[lengthCode.length - 1] === 'r') {
        lengthCode = lengthCode.substring(0, lengthCode.length - 1);
    }

    let lengthFraction = math.fraction(0);

    switch (lengthCode) {
        case '64':
            lengthFraction = math.fraction('1/64');
            break;
        case '32':
            lengthFraction = math.fraction('1/32');
            break;
        case '16':
            lengthFraction = math.fraction('1/16');
            break;
        case '8':
            lengthFraction = math.fraction('1/8');
            break;
        case 'q':
            lengthFraction = math.fraction('1/4');
            break;
        case 'h':
            lengthFraction = math.fraction('1/2');
            break;
        case 'w':
            lengthFraction = math.fraction('1');
            break;
    }

    return lengthFraction as math.Fraction;
  }

  static GetKeySignatureWidth(keySignature: KeySignatureCode): number {
        const width = 10;
        let marks = 0;

        switch (keySignature) {
            case KeySignatureCode.C:
                marks = 0;
                break;
            case KeySignatureCode.G:
                marks = 1;
                break;
            case KeySignatureCode.D:
                marks = 2;
                break;
            case KeySignatureCode.A:
                marks = 3;
                break;
            case KeySignatureCode.E:
                marks = 4;
                break;
            case KeySignatureCode.B:
                marks = 5;
                break;
            case KeySignatureCode.FSharp:
                marks = 6;
                break;
            case KeySignatureCode.CSharp:
                marks = 7;
                break;
            case KeySignatureCode.F:
                marks = 1;
                break;
            case KeySignatureCode.BFlat:
                marks = 2;
                break;
            case KeySignatureCode.EFlat:
                marks = 3;
                break;
            case KeySignatureCode.AFlat:
                marks = 4;
                break;
            case KeySignatureCode.DFlat:
                marks = 5;
                break;
            case KeySignatureCode.GFlat:
                marks = 6;
                break;
            case KeySignatureCode.CFlat:
                marks = 7;
                break;
        }

        return width * marks;
    }

    static CalculateMusicTotalDuration(notes: Chord[]): math.Fraction {
        let totalDuration = math.fraction(0);

        for (let i = 0; i < notes.length; i++) {            
            totalDuration = math.add(totalDuration, notes[i].GetDuration()) as math.Fraction;
        }

        return totalDuration as math.Fraction;
    }

    static DenominatorToNoteDurationCode(fraction: number): string {

        let lengthFraction = 'q';

        switch (fraction) {
            case 64:
                lengthFraction = '64';
                break;
            case 32:
                lengthFraction = '32';
                break;
            case 16:
                lengthFraction = '16';
                break;
            case 8:
                lengthFraction = '8';
                break;
            case 4:
                lengthFraction = 'q';
                break;
            case 2:
                lengthFraction = 'h';
                break;
            case 1:
                lengthFraction = 'w';
                break;
        }

        return lengthFraction;
    }

    static GetNoteList(minNote: Note, maxNote: Note): Note[] {
        const noteList: Note[] = [];

        let octave = minNote.GetOctave();

        let noteIndex = NoteChar.values().indexOf(minNote.GetNote());

        while (octave < maxNote.GetOctave() ||
              (octave === maxNote.GetOctave() && noteIndex <= NoteChar.values().indexOf(maxNote.GetNote()))) {
            
            noteList.push(new Note(NoteChar.values()[noteIndex] as NoteChar, octave));

            noteIndex++;

            if (noteIndex >= NoteChar.values().length) {
                noteIndex = 0;
                octave++;
            }
        }

        return noteList;
    }

    static GetRandomNoteDurations(minDuration: math.Fraction, maxDuration: math.Fraction, totalDuration: math.Fraction): math.Fraction[] {
        if (math.compare(minDuration, maxDuration) == 1) {
            minDuration = maxDuration;
        }

        const minDurationSymbol = MusicUtils.DenominatorToNoteDurationCode(minDuration.d);
        const maxDurationSymbol = MusicUtils.DenominatorToNoteDurationCode(maxDuration.d);

        const noteMinDurationIndex = NoteDuration.values().indexOf(minDurationSymbol);
        const noteMinMaxDurationIndex = NoteDuration.values().indexOf(maxDurationSymbol);

        const noteDurations = [];

        let currentDuration = math.fraction(0);

        while (math.compare(currentDuration, totalDuration) == -1) {

            const noteDurationIndex = Utils.GetRandomInt(noteMinDurationIndex, noteMinMaxDurationIndex);

            const noteDurationSymbol = NoteDuration.values()[noteDurationIndex];

            const noteDuration = MusicUtils.NoteDurationCodeToFraction(noteDurationSymbol);

            if ((noteDuration as math.Fraction).d < (currentDuration as math.Fraction).d) {
                (noteDuration as math.Fraction).d = (currentDuration as math.Fraction).d;
            }

            noteDurations.push(noteDuration);            

            currentDuration = Utils.SumFractionArray(noteDurations);
        }

        return noteDurations;
    }

    static GetRandomChordSize(minSize = 5, maxSize = 5): number {
        const possibleSizes = [];

        for (let i = minSize; i <= maxSize; i = i + 2) {
            possibleSizes.push(i);
        }

        const index = Utils.GetRandomInt(0, possibleSizes.length - 1);

        return possibleSizes[index];
    }

    static GetOmitsOfChordSize(size: number): number[] {
        let omits = [];

        switch (size) {
            case 7:
                omits = [5];
                break;
            case 9:
                omits = [5];
                break;
            case 11:
                omits = [3, 5];
                break;
            case 13:
                omits = [5, 9, 11];
                break;
        }

        return omits;
    }

    static GetInversionIndexList(chordSize = 5): number[] {
        const list = [];

        for (let i = 1; i <= chordSize; i = i + 2) {
            list.push(i);
        }

        return list;
    }

    static MakeHarmonicChord(
        root: Note, size: Number = 5, duration: math.Fraction = math.fraction(1, 4) as math.Fraction, 
        inversionInterval: number = 0, omitIntervals: number[] = [], tieBackward: boolean = false, tieForward: boolean = false): Chord {

        let octave = root.GetOctave();
        let currIndex = NoteChar.values().indexOf(root.GetNote());

        const noteList: Note[] = [];

        for (let i = 1; i <= size; i = i + 2) {
            if (currIndex >= NoteChar.values().length) {
                currIndex = currIndex - NoteChar.values().length;
                octave = octave + 1;
            }

            if (i === inversionInterval && i !== 1) {
                octave = octave - 1;
            }

            if (!omitIntervals.includes(i)) {
                const newNote = new Note();
                newNote.SetNote(NoteChar.values()[currIndex] as NoteChar);
                newNote.SetOctave(octave);
                noteList.push(newNote);                
            }

            currIndex = currIndex + 2;
        }

        const newChord = new Chord();
        newChord.SetNotes(noteList);
        newChord.SetDuration(duration);
        newChord.SetTieBackward(tieBackward);
        newChord.SetTieForward(tieForward);

        return newChord;
    }

    static CreateStaveNote(clef: ClefType, keys: string[], baseDuration: string, dots = 0, tieBackward = false, tieForward = false ): ExtendedNote {
        const note = new ExtendedNote(clef, keys, baseDuration, true);

        if (dots > 0) {
            note.addDotToAll();
        }

        note.SetTieBackward(tieBackward);
        note.SetTieForward(tieForward);

        return note;
    }

    static MakeMelodicChord(
        root = new NoteData(), size = 5, duration = math.fraction(1, 4) as math.Fraction,
        chordDirection = MelodicChordDirection.Ascending, inversionInterval = 0, omitIntervals: number[] = []
    ): Chord[] {
        
        let octave = root.GetOctave();
        let currIndex = NoteChar.values().indexOf(root.GetNote());
        let chordList: Chord[] = [];

        for (let i = 1; i <= size; i = i + 2) {
            if (currIndex >= NoteChar.values().length) {
                currIndex = currIndex - NoteChar.values().length;
                octave = octave + 1;
            }

            if (i === inversionInterval && i !== 1) {
                octave = octave - 1;
            }

            if (!omitIntervals.includes(i)) {
                const newNote = new Note();
                newNote.SetNote(NoteChar.values()[currIndex] as NoteChar);
                newNote.SetOctave(octave);

                const newChord =  new Chord();
                newChord.SetNotes([newNote]);
                newChord.SetDuration(duration);

                chordList.push(newChord);                                
            }

            currIndex = currIndex + 2;
        }

        if (chordDirection === MelodicChordDirection.Descending) {
            chordList = chordList.reverse();
        } else if (chordDirection === MelodicChordDirection.Random) {
            chordList = Utils.ShuffleArray(chordList);
        }

        return chordList;
    }

    static GetRandomKeySignature(): string {
        const index = Utils.GetRandomInt(0, KeySignatureCode.values().length - 1);

        return KeySignatureCode.values()[index];
    }

    static TransposeChordContainer(container: ChordContainer, transposeSize: number): ChordContainer { // , clef = ClefType.Treble
        const newContainer = new ChordContainer();
        newContainer.SetTimeSignature(container.GetTimeSignature());

        const newChords = [];

        const chords = container.GetChords();

        for (let i = 0; i < chords.length; i++) {
            const chord = chords[i];
            
            const newChord = MusicUtils.TransposeChord(chord, transposeSize);

            newChords.push(newChord);
        }

        newContainer.SetChords(newChords);

        return newContainer;
    }

    static TransposeChord(chord: Chord, transposeSize: number): Chord {
        const notes = [];
    
        const chordNotes = chord.GetNotes();

        for (let i = 0; i < chordNotes.length; i++) {
            const note = chordNotes[i];

            const newNote = MusicUtils.TransposeNote(note, transposeSize);

            notes.push(newNote);
        }

        const newChord = new Chord();
        newChord.SetNotes(notes);
        newChord.SetTieBackward(chord.GetTieBackward());
        newChord.SetTieForward(chord.GetTieForward());
        newChord.SetDuration(chord.GetDuration() as math.Fraction);

        return newChord;
    }

    static TransposeNote(note: Note, transposeSize = 1): Note {
        
        const noteChar = note.GetNote();
        let octave = note.GetOctave();
        
        let index = NoteChar.values().indexOf(noteChar);

        let indexModifier = 1;
        if (transposeSize < 0) {
            indexModifier = -1;
        }

        let notesTraversed = 0;

        const steps = math.abs(transposeSize);

        while (notesTraversed < steps) {
            index = index + indexModifier;

            if (index < 0 || index >= NoteChar.values().length) {
                index = index - indexModifier * NoteChar.values().length;

                octave = octave + indexModifier;
            }

            notesTraversed++;
        }

        const newNote = new Note();
        newNote.SetDuration(note.GetDuration() as math.Fraction);
        newNote.SetSharpsFlats(note.GetSharpsFlats());
        newNote.SetOctave(octave);
        newNote.SetNote(NoteChar.values()[index] as NoteChar);        
        
        return newNote;        
    }
    
    static GetClefLimits(clef = ClefType.Treble): {min: Note, max: Note} {
        let min = new Note();
        let max = new Note();

        switch (clef) {
            case ClefType.FrenchViolin:
                min = new Note(NoteChar.E, 4);
                max = new Note(NoteChar.C, 6);
                break;
            case ClefType.Treble:
                min = new Note(NoteChar.C, 4);
                max = new Note(NoteChar.A, 5);
                break;
            case ClefType.Soprano:
                min = new Note(NoteChar.A, 3);
                max = new Note(NoteChar.F, 5);
                break;
            case ClefType.MezzoSoprano:
                min = new Note(NoteChar.F, 3);
                max = new Note(NoteChar.D, 5);
                break;
            case ClefType.Alto:
                min = new Note(NoteChar.D, 3);
                max = new Note(NoteChar.B, 4);
                break;
            case ClefType.Tenor:
                min = new Note(NoteChar.B, 2);
                max = new Note(NoteChar.G, 4);
                break;
            case ClefType.BaritoneC:
                min = new Note(NoteChar.G, 2);
                max = new Note(NoteChar.E, 4);
                break;
            case ClefType.BaritoneF:
                min = new Note(NoteChar.G, 2);
                max = new Note(NoteChar.E, 4);
                break;
            case ClefType.Bass:
                min = new Note(NoteChar.E, 2);
                max = new Note(NoteChar.C, 4);
                break;
            case ClefType.SubBass:
                min = new Note(NoteChar.C, 2);
                max = new Note(NoteChar.A, 3);
                break;
        }

        return {min: min, max: max};
    }

    static MinorKeySignatureCodeToRelativeMajor(root = 'C'): string {
        switch (root) {
            case 'A':
                return 'C';
            case 'E':
                return 'G';
            case 'B':
                return 'D';
            case 'F#':
                return 'A';
            case 'C#':
                return 'E';
            case 'G#':
                return 'B';
            case 'D#':
                return 'F#';
            case 'A#':
                return 'C#';
            case 'D':
                return 'F';
            case 'G':
                return 'Bb';
            case 'C':
                return 'Eb';
            case 'F':
                return 'Ab';
            case 'Bb':
                return 'Db';
            case 'Eb':
                return 'Gb';
            case 'Ab':
                return 'Cb';
        }

        return '';
    }

    static CompareNotes(noteData1 = new Note(), noteData2 = new Note()): number {
        const octave1 = noteData1.GetOctave();
        const octave2 = noteData2.GetOctave();

        if (octave1 > octave2) {
            return 1;
        } else if (octave1 < octave2) {
            return -1;
        } else {
            const note1Index = NoteChar.values().indexOf(noteData1.GetNote());
            const note2Index = NoteChar.values().indexOf(noteData2.GetNote());

            if (note1Index > note2Index) {
                return 1;
            }

            if (note1Index < note2Index) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    static GetNoteScaleDistance(noteData1: Note, noteData2: Note): number {

        const octave1 = noteData1.GetOctave();
        const octave2 = noteData2.GetOctave();

        const noteIndex1 = NoteChar.values().indexOf(noteData1.GetNote());
        const noteIndex2 = NoteChar.values().indexOf(noteData2.GetNote());

        let distance = (octave1 - octave2) * 7;

        distance += noteIndex1 - noteIndex2;

        return distance;
    }
}
