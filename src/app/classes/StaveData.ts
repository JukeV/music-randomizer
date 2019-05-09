import { Flow } from 'vexflow';

import { TimeSignature } from './Timesignature';
import { Chord } from './Chord';
import { MusicUtils } from './MusicUtils';
import { ClefType } from '../enums/ClefType';
import { KeySignatureCode } from '../enums/KeySignatureCode';
import { ExtendedNote } from './ExtendedNote';


export class StaveData {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    chords: Chord[] = [];
    staveNotes: ExtendedNote[] = [];
    clef: ClefType = ClefType.Treble;
    timeSignature: TimeSignature = new TimeSignature(4, 4);
    keySignature: KeySignatureCode = KeySignatureCode.C;
    stave: Flow.Stave;
    addTimeSignature: boolean = false;
    addClef: boolean = false;
    voice: Flow.Voice;
    voiceAndBeamsUpToDate: boolean = false;
    beams: Flow.Beam[];
    constructor() {
    }

    GetVoice(): Flow.Voice {

        if (!this.voiceAndBeamsUpToDate) {
            this.UpdateVoiceAndBeams();
        }

        return this.voice;
    }

    GetBeams(): Flow.Beam[] {
        if (!this.voiceAndBeamsUpToDate) {
            this.UpdateVoiceAndBeams();
        }

        return this.beams;
    }

    AddChord(chord: Chord) {
        this.chords.push(chord);
        this.voiceAndBeamsUpToDate = false;
    }

    AddChords(chords: Chord[]) {
        this.chords = this.chords.concat(chords);
        this.voiceAndBeamsUpToDate = false;
    }

    SetChords(chords: Chord[]) {
        this.chords = chords;
        this.voiceAndBeamsUpToDate = false;
    }

    GetChords(): Chord[] {
        return this.chords;
    }

    SetConfines(x: number, y: number, width: number) {
        this.x = x;
        this.y = y;
        this.width = width;
    }

    AddTimeSignature(value: boolean) {
        this.addTimeSignature = value;
    }

    SetKeySignature(value: KeySignatureCode) {
        this.keySignature = value;
    }

    GetKeySignature(): KeySignatureCode {
        return this.keySignature;
    }

    GetTimeSignature(): TimeSignature {
        return this.timeSignature;
    }

    AddClef(value: boolean) {
        this.addClef = value;
    }

    SetClef(clef: ClefType) {
        this.clef = clef;
    }

    SetTimeSignature(nominator: number, denominator: number) {
        this.timeSignature = new TimeSignature(nominator, denominator);
    }

    GetStaveNotes(): ExtendedNote[] {
        return this.staveNotes;
    }

    PrepareStave(): void {
        this.PrepareStaveNotes();
        this.stave = new Flow.Stave(this.x, this.y, this.width);
        if (this.addClef) {
            this.stave.addClef(this.clef);
            this.stave.addKeySignature(this.keySignature);
        }

        if (this.addTimeSignature) {
            this.stave.addTimeSignature(this.timeSignature.GetTimeSignature());
        }
    }

    GetStave(): Flow.Stave {
        return this.stave;
    }

    UpdateVoiceAndBeams(): void {
        this.voice = new Flow.Voice({num_beats: this.timeSignature.nominator, beat_value: this.timeSignature.denominator});
        this.voice.addTickables(this.staveNotes);
        this.beams = Flow.Beam.applyAndGetBeams(this.voice, undefined, undefined);
        this.voiceAndBeamsUpToDate = true;
    }

    Draw(context: Vex.IRenderContext): void {
        this.stave.setContext(context).draw();

        this.GetVoice().draw(context, this.stave);

        this.GetBeams().forEach(function(beam) {
            beam.setContext(context).draw();
        });
    }

    private PrepareStaveNotes(): void{

        const staveNotes: ExtendedNote[] = [];

        for(let i = 0; i < this.chords.length; i++){
            staveNotes.push(MusicUtils.CreateStaveNote(this.clef, this.chords[i].GetNoteSymbols(), this.chords[i].GetDurationSymbol(), 0, this.chords[i].GetTieBackward(), this.chords[i].GetTieForward()));
        }

        // return staveNotes;
        this.staveNotes = staveNotes;
    }
}
