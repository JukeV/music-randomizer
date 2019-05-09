import { Flow } from 'vexflow';

import { MusicUtils } from './MusicUtils';

import * as math from 'mathjs';
import { StaveData } from './StaveData';
import { Chord } from './Chord';

export class StaveSlice {

    staveDatas: StaveData[] = [];
    staveHeight: number = 150;
    div: HTMLElement;
    x: number = 0;
    addFirstStaveBars: boolean = false;
    addTimeSignature: boolean = false;
    addClef: boolean = false;
    noteWidth: number = 40;
    clefWidth: number = 30;
    timeSignatureWidth: number = 30;
    widthScale: number = 1;
    width: number = 0;
    useScaledWidth: boolean = false;

    constructor() {
    }


    SetTimesignatureWidth(value: number): void {
        this.timeSignatureWidth = value;
    }

    SetClefWidth(value: number): void {
        this.clefWidth = value;
    }

    AddStave(staveData: StaveData): void {
        this.staveDatas.push(staveData);
    }

    AddStaves(staveDatas: StaveData[]): void {
        this.staveDatas = this.staveDatas.concat(staveDatas);
    }

    GetStaveData(index: number): StaveData {
        return this.staveDatas[index];
    }

    GetStaveDatas(): StaveData[] {
        return this.staveDatas;
    }

    SetDiv(div: HTMLElement): void {
        this.div = div;
    }

    SetNoteWidth(value: number): void {
        this.noteWidth = value;
    }

    GetNoteWidth(): number {
        return this.noteWidth;
    }

    SetWidthScale(value: number): void {
        this.widthScale = value;
    }

    GetScaledWidth(): number {
        const baseWidth = this.GetSliceBaseWidth();

        const rounded = Math.floor(baseWidth * this.widthScale);

        return rounded;
    }

    UseScaledWidth(value: boolean): void {
        this.useScaledWidth = value;
    }

    SetWidth(width: number): void {
        this.width = width;
    }

    GetWidth(): number {
        return this.width;
    }

    CountUniqueNoteTimes(): number {
        let uniqueTimes = 0;
        let currentTime = math.fraction(-1);

        while (true) {
            let nextTime = math.fraction(this.staveDatas[0].GetTimeSignature().GetTimeSignature());

            let noteFound = false;

            for ( let i = 0; i < this.staveDatas.length; i++) {
                const nextStaveNoteTime = this.GetNoteListNextTiming(this.staveDatas[i].GetChords(), currentTime as math.Fraction);

                if (math.compare(nextStaveNoteTime, math.fraction(0)) != -1) {
                    if (math.compare(nextStaveNoteTime, nextTime) == -1 ) {
                        nextTime = nextStaveNoteTime;
                        noteFound = true;
                    }
                }
            }

            if (!noteFound) {
                break;
            }

            currentTime = nextTime;

            uniqueTimes++;
        }

        return uniqueTimes;
    }

    GetNoteListNextTiming(chordList: Chord[], start: math.Fraction) {
        let currentPosition = math.fraction(0);

        for (let i = 0; i < chordList.length; i++) {
            if (math.compare(start, currentPosition) == -1) {
                return currentPosition;
            }

            const chordDuration = chordList[i].GetDuration();

            currentPosition = math.add(currentPosition, chordDuration) as math.Fraction;
        }

        return math.fraction(-1);
    }

    GetSliceBaseWidth(): number {
        const maxUniqueNoteTimes = this.CountUniqueNoteTimes();

        let width = maxUniqueNoteTimes * this.noteWidth;

        if (this.addTimeSignature) {
            width += this.timeSignatureWidth;
        }
        if (this.addClef) {
            width += this.clefWidth;

            width += MusicUtils.GetKeySignatureWidth(this.staveDatas[0].GetKeySignature());
        }

        return width;
    }

    SetX(x: number): void {
        this.x = x;
    }

    SetStaveHeight(height: number): void {
        this.staveHeight = height;
    }

    AddTimeSignature(value: boolean): void {
        this.addTimeSignature = value;
    }

    AddClef(value: boolean): void {
        this.addClef = value;
    }

    AddFirstStaveBars(value: boolean): void {
        this.addFirstStaveBars = value;
    }

    GetVoiceList() {
        const voiceList = [];

        for (let i = 0; i < this.staveDatas.length; i++) {
            voiceList.push(this.staveDatas[i].GetVoice());
        }

        return voiceList;
    }

    GetMaxNoteStartX() {
        let max = 0;

        for ( let i = 0; i < this.staveDatas.length; i++) {
            const x = this.staveDatas[i].GetStave().getNoteStartX();

            if (x > max) {
                max = x;
            }
        }

        return max;
    }

    DrawMultiStaveBars(stave1, stave2, context) {
        const brace = new Flow.StaveConnector(stave1, stave2).setType(3);
        const lineLeft = new Flow.StaveConnector(stave1, stave2).setType(1);

        brace.setContext(context).draw();
        lineLeft.setContext(context).draw();
    }

    DrawMultiStaveRightBar(stave1, stave2, context) {
        const lineRight = new Flow.StaveConnector(stave1, stave2).setType(0);
        lineRight.setContext(context).draw();
    }

    Draw(context) {
        const formatter = new Flow.Formatter();

        for (let i = 0; i < this.staveDatas.length; i++) {
            let width = 0;

            if (this.useScaledWidth) {
                width = this.GetScaledWidth();
            } else {
                width = this.width;
            }

            this.staveDatas[i].AddTimeSignature(this.addTimeSignature);
            this.staveDatas[i].AddClef(this.addClef);
            this.staveDatas[i].SetConfines(this.x, i * this.staveHeight + 10, width);
            this.staveDatas[i].PrepareStave();
            formatter.joinVoices([this.staveDatas[i].GetVoice()]);
        }

        const voiceList = this.GetVoiceList();

        formatter.formatToStave(voiceList, this.staveDatas[0].GetStave(), {align_rests: true, context: undefined});

        const max_x = this.GetMaxNoteStartX();

        for (let i = 0; i < this.staveDatas.length; i++) {
            this.staveDatas[i].GetStave().setNoteStartX(max_x);
        }

        for (let i = 0; i < this.staveDatas.length; i++) {
            this.staveDatas[i].Draw(context);
        }

        const topStave = this.staveDatas[0].GetStave();
        const bottomStave = this.staveDatas[this.staveDatas.length - 1].GetStave();

        if (this.staveDatas.length > 1) {
            if (this.addFirstStaveBars) {
                this.DrawMultiStaveBars(topStave, bottomStave, context);
            }

            this.DrawMultiStaveRightBar(topStave, bottomStave, context);
        }
    }
}
