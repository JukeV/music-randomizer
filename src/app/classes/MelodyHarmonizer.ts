import { ChordContainer } from './ChordContainer';
import { MusicKey } from './MusicKey';
import { ClefType } from '../enums/ClefType';
import { HarmonizationType } from '../enums/HarmonizationType';
import { Utils } from './utils'
import { MusicUtils } from './MusicUtils';

import { NoteRandomizerBaseClass } from './NoteRandomizerBaseClass';
import { Note } from './Note';
import { NoteChar } from '../enums/NoteChar';
import { Chord } from './Chord';

import * as math from 'mathjs';
import * as cloneDeep from 'lodash/cloneDeep';


export class MelodyHarmonizer extends NoteRandomizerBaseClass {

    melody: ChordContainer;

    key: MusicKey;

    clef: ClefType;

    harmonizationTypes: HarmonizationType[] = [];

    constructor() {
        super();    
    }

    SetMelody(container: ChordContainer){
        this.melody = container;
    }

    SetKey(value: MusicKey) {
        this.key = value;
    }

    SetClef(value: ClefType){
        this.clef = value;
    }

    SetHarmonizationTypes(value: HarmonizationType[]) {
        this.harmonizationTypes = value;    
    }

    AddHarmonizationType(value: HarmonizationType){
        if(!this.harmonizationTypes.includes(value)){
            this.harmonizationTypes.push(value);
        }
    }

    Create() {
        const melody = this.melody.GetChords();
        this.CreateNoteDurationList();

        let harmony: Chord[] = [];

        let prevChord: Chord;

        let i = 0;

        let barRemaining: math.Fraction = this.timeSignature.GetFraction();

        let edgeChord = true;        
        
        while (i < melody.length) {
            let noteDuration = this.GetNextNoteDuration(barRemaining);

            /*
            barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;
            if(math.equal(barRemaining, math.fraction(0))) {
                barRemaining = this.timeSignature.GetFraction();
            }
            */

            barRemaining = this.GetBarRemaining(barRemaining, noteDuration, this.timeSignature.GetFraction());            

            let nextHarmonizationDuration = melody[i].GetDuration();
            const harmonizationChords: Chord[] = [];

            const harmonizationTypeIndex = Utils.GetRandomInt(0, this.harmonizationTypes.length - 1);

            const harmonizationType = this.harmonizationTypes[harmonizationTypeIndex];
            
            if(math.smallerEq(nextHarmonizationDuration, noteDuration)){

                // let harmonizedDuration = noteDuration;                

                while(math.smallerEq(nextHarmonizationDuration, noteDuration)) {

                    // console.log('max:' + melody.length.toString() + ' i: ' + i.toString() + ' duration: ' + melody[i].GetDuration().toString());
                    /*
                    if(i >= melody.length){
                        console.log('melody:' + melody.length.toString() + ' i: ' + i.toString());
                    }
                    */

                    harmonizationChords.push(melody[i]);                    
                    i++;

                    if(i === melody.length - 1){
                        edgeChord = true;
                    }

                    if(i >= melody.length){
                        break;
                    }
                    nextHarmonizationDuration = math.add(nextHarmonizationDuration, melody[i].GetDuration()) as math.Fraction;                         
                    
                }
                /*
                if(math.smaller(noteDuration, nextHarmonizationDuration)){ // because note lengths doesn't match, reharmonize last note
                    i--;
                }
                */

                // harmonizedDuration = math.sum(harmonizedDuration, noteDuration);

                let chord: Chord;

                if(harmonizationType === HarmonizationType.Note) {
                    chord = this.HarmonizeWithNote(noteDuration, harmonizationChords, prevChord, edgeChord);
                } else if(harmonizationType === HarmonizationType.Chord) {
                    chord = this.HarmonizeWithChord(noteDuration, harmonizationChords, prevChord, edgeChord);
                } else if(harmonizationType === HarmonizationType.OneFourFive) {
                    chord = this.HarmonizeWith145Chords(noteDuration, harmonizationChords, false, edgeChord);
                } else if(harmonizationType === HarmonizationType.OneFourFiveAlternativeInversions) {
                    chord = this.HarmonizeWith145Chords(noteDuration, harmonizationChords, true, edgeChord);
                }

                prevChord = chord;
                harmony = harmony.concat(chord);

                if(i === melody.length - 1){
                    edgeChord = true;
                } else {
                    edgeChord = false;
                }
                
                // i++;
            } else {

                let harmonizedDuration = math.fraction(0) as math.Fraction;

                let first = true;

                while (math.smaller(harmonizedDuration, nextHarmonizationDuration)) {

                    let lastChord = false;

                    if(!first){                        
                        noteDuration = this.GetNextNoteDuration(barRemaining);

                        // barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;                        
                        barRemaining = this.GetBarRemaining(barRemaining, noteDuration, this.timeSignature.GetFraction());            
                    }

                    harmonizedDuration = math.sum(harmonizedDuration, noteDuration);

                    if(math.equal(harmonizedDuration, nextHarmonizationDuration) && edgeChord){
                        lastChord = true;
                    } else {
                        lastChord = false;
                    }                    

                    let chord: Chord;

                    if(harmonizationType === HarmonizationType.Note) {
                        chord = this.HarmonizeWithNote(noteDuration, [melody[i]], prevChord, lastChord);
                    } else if(harmonizationType === HarmonizationType.Chord) {
                        chord = this.HarmonizeWithChord(noteDuration, [melody[i]], prevChord, lastChord);
                    } else if(harmonizationType === HarmonizationType.OneFourFive) {
                        chord = this.HarmonizeWith145Chords(noteDuration, [melody[i]], false, lastChord);
                    } else if(harmonizationType === HarmonizationType.OneFourFiveAlternativeInversions) {
                        chord = this.HarmonizeWith145Chords(noteDuration, [melody[i]], true, lastChord);
                    }

                    prevChord = chord;
                    harmony = harmony.concat(chord);

                    // barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;

                    first = false;
                }

                i++;

                if(i === melody.length - 1){
                    edgeChord = true;
                } else {
                    edgeChord = false;
                }
            }
            

            /*            
            // virhe, ei toimi kun harmonisaationuotti on lyhempi kuin harmonisoitava
            while(math.smallerEq(nextHarmonizationDuration, noteDuration)) {
                harmonizationChords.push(melody[i]);
                nextHarmonizationDuration = math.add(nextHarmonizationDuration, melody[i].GetDuration()) as math.Fraction;
                i++;               
            }
            if(math.smaller(noteDuration, nextHarmonizationDuration)){ // because note lengths doesn't match, reharmonize last note
                i--;
            }
            */

            

            
            /* else if(harmonizationType === HarmonizationType.Melody) {
                harmony = harmony.concat(this.HarmonizeWithMelody(noteDuration, harmonizationChords));
            } */

            
        }

        this.chordContainer = new ChordContainer();
        this.chordContainer.SetChords(harmony);
        this.chordContainer.SetTimeSignature(this.timeSignature);
    }

    private GetBarRemaining(barRemaining: math.Fraction, noteDuration: math.Fraction, timeSignature: math.Fraction): math.Fraction {

        barRemaining = math.subtract(barRemaining, noteDuration) as math.Fraction;

        if(math.equal(barRemaining, math.fraction(0))) {
            barRemaining = timeSignature;
        }

        return barRemaining;
    }

    /*
    GetNextNoteDuration(maxDuration: math.Fraction): math.Fraction {        

        let duration: math.Fraction = Utils.GetRandomItemFromArray(this.noteDurationList);
        
        if(math.larger(duration, math.fraction(1, maxDuration.d))){
            duration = math.fraction(1, maxDuration.d) as math.Fraction;
        }

        return duration;

    }
    */

    GetConsonanceNotes(note: Note): Note[] {
        const notes: Note[] = [];        

        /*
        let modifier = 1;

        if(Utils.GetRandomInt(0, 1) === 1){
            modifier = -1;
        }
        */

        for(let i = -4; i <= 4; i = i + 2) {
            notes.push(MusicUtils.TransposeNote(note, i));
        }

        return notes;
    }

    ConfineChordSet(chords: Chord[], minNote: Note, maxNote: Note): Chord[]{

        let transposing = true;
        let transposeUp = false;
        let transposeDown = false;
        let transposingUp = false;
        let transposingDown = false;

        while(transposing){
            transposing = false;
            chords.forEach(chord => { 
                if(MusicUtils.CompareNotes(chord.GetMaxNote(), maxNote) === 1 && !transposingUp){
                    transposeDown = true;   
                    transposingDown = true;
                } else if (MusicUtils.CompareNotes(chord.GetMinNote(), minNote) === -1 && !transposingDown){
                    transposeUp = true;
                    transposingUp = true;
                }
            });

            if(transposeDown){
                transposing = true;

                for(let i = 0; i < chords.length; i++){
                    chords[i] = MusicUtils.TransposeChord(chords[i], -7);
                }


            } else if (transposeUp) {
                transposing = true;

                for(let i = 0; i < chords.length; i++){
                    chords[i] = MusicUtils.TransposeChord(chords[i], 7);
                }
            }

            transposeUp = false;
            transposeDown = false;
        }
        
        /*
        if(transposeUp){
            let transpose = false;
            chords.forEach(chord => { 
                if(MusicUtils.CompareNotes(chord.GetMaxNote(), maxNote) === 1){
                    transpose = true;                    
                } 
            });         
        } else if (transposeDown){

        }

        while(MusicUtils.CompareNotes( chord.GetMaxNote(), maxNote) === 1){
            chord = MusicUtils.TransposeChord(chord, -7);
        }
        while(MusicUtils.CompareNotes( chord.GetMinNote(), minNote) === -1){
            chord = MusicUtils.TransposeChord(chord, 7);
        }
        */
        return chords;
    }

    ConfineChord(chord: Chord, minNote: Note, maxNote: Note): Chord{
        
        chord.GetNotes().forEach(note => {
            /*
            while(MusicUtils.CompareNotes(minNote, note) === 1){
                note.SetOctave(note.GetOctave() + 1);
            }

            while(MusicUtils.CompareNotes(note, maxNote ) === 1){
                note.SetOctave(note.GetOctave() + -1);
            }
            */
            note = this.ConfineNote(note, minNote, maxNote);

            if(note === null) {
                return null;
            }
        });
        
        return chord;
    }

    ConfineNote(note: Note, minNote: Note, maxNote: Note): Note {
        while(MusicUtils.CompareNotes(minNote, note) === 1){
            note.SetOctave(note.GetOctave() + 1);
        }

        while(MusicUtils.CompareNotes(note, maxNote ) === 1){
            note.SetOctave(note.GetOctave() + -1);
        }

        if(MusicUtils.CompareNotes(minNote, note) === 1 || MusicUtils.CompareNotes(note, maxNote ) === 1) {
            return null;
        }

        return note;
    }

    
    HarmonizeWithNote(duration: math.Fraction, chords: Chord[], previousChord: Chord = undefined, edgeChord = false): Chord {

        let chord = new Chord();
        let note: Note;

        if(edgeChord){
            note = this.key.GetRootNote();

            if(previousChord != null){ 
                note = this.ConfineNote(note, MusicUtils.TransposeNote(previousChord.GetMinNote(), -7), MusicUtils.TransposeNote(previousChord.GetMaxNote(), 7));            
            }

            note = this.ConfineNote(note, this.minNote, this.maxNote);

            /*
            chord.SetDuration(duration);
            chord.AddNote(note);                
            */
            
        } else {
            const harmonizeChord: Chord = Utils.GetRandomItemFromArray(chords);

            const consonanceNotes: Note[] = this.GetConsonanceNotes(harmonizeChord.GetNotes()[0]);       

            const octave = Utils.GetRandomInt(this.minNote.GetOctave(), this.maxNote.GetOctave());
            
            note = null;

            while(note === null){
                note = Utils.GetRandomItemFromArray(consonanceNotes);
                note.SetOctave(octave);
                if(previousChord != null){ 
                    note = this.ConfineNote(note, MusicUtils.TransposeNote(previousChord.GetMinNote(), -7), MusicUtils.TransposeNote(previousChord.GetMaxNote(), 7));            
                }
                note = this.ConfineNote(note, this.minNote, this.maxNote);
            }                
        }
        
        chord.SetDuration(duration);
        chord.AddNote(note);                

        return chord;
    }

    HarmonizeWith145Chords(duration: math.Fraction, chords: Chord[], alternativeInversions: boolean, edgeChord = false): Chord{

        const limits = this.GetHarmonyLimits(this.clef, this.key);

        const rootNote = this.key.GetRootNote();

        let root: Chord;
        let fourth: Chord;
        let fifth: Chord;

        if (alternativeInversions){
            // root = MusicUtils.MakeHarmonicChord(limits.min, 5, duration, 3);

            fourth = MusicUtils.MakeHarmonicChord(MusicUtils.TransposeNote(rootNote, 3), 5, duration);

            fifth = MusicUtils.MakeHarmonicChord(MusicUtils.TransposeNote(rootNote, 4), 7, duration, 5, [5]);

            root = MusicUtils.MakeHarmonicChord(MusicUtils.TransposeNote(rootNote, 7), 5, duration, 3);
        } else {
            root = MusicUtils.MakeHarmonicChord(rootNote, 5, duration);

            fourth = MusicUtils.MakeHarmonicChord(MusicUtils.TransposeNote(rootNote, 3), 5, duration, 5);

            fifth = MusicUtils.MakeHarmonicChord(MusicUtils.TransposeNote(rootNote, 4), 7, duration, 3, [5]);
        }        

        let availableChords = this.ConfineChordSet([root, fourth, fifth], this.minNote, this.maxNote);

        if(edgeChord) {
            return this.ConfineChord(availableChords[0], this.minNote, this.maxNote);
        } 

        availableChords = Utils.ShuffleArray(availableChords);

        /*
        root = this.ConfineWholeChord(root, this.minNote, this.maxNote);
        fourth = this.ConfineWholeChord(fourth, this.minNote, this.maxNote);
        fifth = this.ConfineWholeChord(fifth, this.minNote, this.maxNote);

        const availableChords: Chord [] = [];
        availableChords.push(root);
        availableChords.push(fourth);
        availableChords.push(fifth);
        */

        const harmonizeChord: Chord = Utils.GetRandomItemFromArray(chords);

        let consonanceNotes: Note[] = this.GetConsonanceNotes(harmonizeChord.GetNotes()[0]);

        consonanceNotes = Utils.ShuffleArray(consonanceNotes);

        let returnChord: Chord;
        let chordFound = false;

        while (chordFound === false) {           

            const note: Note = Utils.GetRandomItemFromArray(consonanceNotes);

            availableChords.forEach(chord => {
                if(this.ChordHasNote(chord, note.GetNote())){
                    returnChord = chord;                    
                    chordFound = true;
                }
            });
        }

        return returnChord;
    }

    ChordHasNote(chord: Chord, noteChar: NoteChar){
        if(chord.notes.some(note => {
            return note.GetNote() === noteChar;
        })){
            return true;
        }

        return false;
    }

    HarmonizeWithChord(duration: math.Fraction, chords: Chord[], previousChord: Chord = undefined, edgeChord = false): Chord{

        let inversionInterval = -1;

        let rand = Utils.GetRandomInt(0, 2);

        if(rand === 0){
            inversionInterval = 3;
        } else if (rand === 1) {
            inversionInterval = 5;
        }

        if(edgeChord) {
            let chord = MusicUtils.MakeHarmonicChord(this.key.GetRootNote(), 5, duration, inversionInterval);

            chord = this.ConfineChord(chord, this.minNote, this.maxNote);

            return chord;
            //return this.ConfineChord(root, this.minNote, this.maxNote);
        } 

        const harmonizeChord: Chord = Utils.GetRandomItemFromArray(chords);

        const consonanceNotes: Note[] = this.GetConsonanceNotes(harmonizeChord.GetNotes()[0]);  
        
        const availableNotes = this.GetAvailableNotes(consonanceNotes, this.minNote, this.maxNote);

        const rootNote: Note = Utils.GetRandomItemFromArray(availableNotes);
        
        let chord = MusicUtils.MakeHarmonicChord(rootNote, 5, duration, inversionInterval);

        if(previousChord != null){ 
            chord = this.ConfineChord(chord, MusicUtils.TransposeNote(previousChord.GetMinNote(), -7), MusicUtils.TransposeNote(previousChord.GetMaxNote(), 7));            
        }

        /*
        const limits = this.GetHarmonyLimits(this.clef, this.key);

        chord = this.ConfineChord(chord, limits.min, limits.max);
        */
        
        chord = this.ConfineChord(chord, this.minNote, this.maxNote);

        return chord;
    }

    GetAvailableNotes(notes: Note[], minNote: Note, maxNote: Note): Note[] {
        const noteList: Note[] = MusicUtils.GetNoteList(minNote, maxNote);

        const returnNotes: Note[] = [];

        for(let i = 0; i < notes.length; i++){
            for(let j = 0; j < noteList.length; j++){
                if(notes[i].GetNote() == noteList[j].GetNote()){
                    returnNotes.push(new Note(noteList[i].GetNote(), noteList[j].GetOctave(), notes[i].GetDuration() as math.Fraction));
                }
            }
        }

        return returnNotes;
    }
    
    HarmonizeWithMelody(duration: math.Fraction, chords: Chord[]): Chord {
        const note = new Note(NoteChar.C, 4, math.fraction(1, 4) as math.Fraction);

        const chord = new Chord();
        chord.AddNote(note);

        return chord;
    }

    

    GetHarmonyLimits(clef: ClefType, key: MusicKey): {min: Note, max: Note} { // treble and bass clef only

        let baseNote: Note;

        if(clef === ClefType.Treble) {
            baseNote = new Note(NoteChar.C, 4);
        } else if(clef === ClefType.Bass) {
            baseNote = new Note(NoteChar.E, 2);
        } else {
            return null;
        }

        const root = key.GetRootNote();

        const minNote = this.GetNoteAbove(baseNote, root.GetNote());

        const maxNote = MusicUtils.TransposeNote(minNote, 6);
        
        return {min: minNote, max: maxNote}
    }    

    GetNoteAbove(baseNote: Note, note: NoteChar): Note {
        
        let returnNote: Note = cloneDeep(baseNote);
        
        while(true){
            if(returnNote.GetNote() === note) {
                break;
            }
            returnNote = MusicUtils.TransposeNote(returnNote, 1);            
        }

        return returnNote;
    }
}
