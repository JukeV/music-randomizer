import { Flow } from 'vexflow';

import { StaveSlice } from './StaveSlice';
import { StaveRow } from './StaveRow';
import { StaveData } from './StaveData';

import { KeySignatureCode } from '../enums/KeySignatureCode';
import { ChordContainer } from './ChordContainer';

export class MusicScore {

    staveSlices: StaveSlice[] = [];

    staveRows: StaveRow[] = [];

    div: HTMLElement;
    subDivName = 'staveSlice';
    staveHeight = 120;
    expectedScoreWidth = 1400;
    leftBuffer = 15;

    drawing = false;
    redraw = false;

    staveRowsPrepared = false;

    keySignature = KeySignatureCode.C;

    constructor() {

    }


    SetExpectedScoreWidth(width: number): void {
        this.expectedScoreWidth = width;
    }

    GetScoreWidth(): number {
        const baseWidth = this.staveRows[0].GetBaseWidth();
        const scale = this.staveRows[0].GetWidthScale();

        return baseWidth * scale;
    }

    SetDiv(div: HTMLElement): void {
        this.div = div;
    }

    SetKeySignature(value: KeySignatureCode): void {
        this.keySignature = value;
    }

    AddStaveSlice(slice: StaveSlice): void {
        this.staveSlices.push(slice);
    }

    CreateStaveSlice(staveDatas: StaveData[]): void {
        const slice = new StaveSlice();

        slice.AddStaves(staveDatas);

        this.AddStaveSlice(slice);
    }

    CreateStaveSlicesFromChordContainers(chordContainers: ChordContainer[] = []): void {
        this.staveSlices = [];

        while (true) {
            const slice = new StaveSlice();

            let breakLoop = false;

            for (let i = 0; i < chordContainers.length; i++) {
                if (chordContainers[i].GetChords().length > 0) {
                    const staveData = new StaveData();
                    const chords = chordContainers[i].PullChordSet();

                    staveData.AddChords(chords);
                    staveData.SetClef(chordContainers[i].GetClefType());

                    const nominator = chordContainers[i].GetTimeSignature().nominator;
                    const denominator = chordContainers[i].GetTimeSignature().denominator;

                    staveData.SetTimeSignature(nominator, denominator);
                    staveData.SetKeySignature(this.keySignature);

                    slice.AddStave(staveData);
                } else {
                    breakLoop = true;
                    break;
                }
            }

            if (breakLoop) {
                break;
            }

            this.staveSlices.push(slice);
        }
    }

    SetSubDivName(name: string): void {
        this.subDivName = name;
    }

    PrepareStaveRows(): void {
        this.staveRows = [];

        let row = new StaveRow();
        row.AddTimeSignature(true);
        row.SetExpectedWidth(this.expectedScoreWidth);

        let newRow = true;

        for (let i = 0; i < this.staveSlices.length; i++) {
            if (newRow) {
                if (this.staveSlices[i].GetStaveDatas().length > 1) {
                    this.staveSlices[i].AddFirstStaveBars(true);
                } else                {
                    this.staveSlices[i].AddFirstStaveBars(false);
                }

                this.staveSlices[i].AddClef(true);

                if (i === 0) {
                    this.staveSlices[i].AddTimeSignature(true);
                }

                newRow = false;
            } else {
                this.staveSlices[i].AddFirstStaveBars(false);
                this.staveSlices[i].AddClef(false);
                this.staveSlices[i].AddTimeSignature(false);
            }

            row.AddStaveSlice(this.staveSlices[i]);

            if (typeof this.staveSlices[i + 1] === 'undefined') {
                this.staveRows.push(row);
                break;
            }

            if (row.GetBaseWidth() + this.staveSlices[i + 1].GetSliceBaseWidth() > row.GetExpectedWidth()) {
                this.staveRows.push(row);
                row = new StaveRow();
                row.SetExpectedWidth(this.expectedScoreWidth);
                newRow = true;
            }
        }
    }

    Draw(): void {
        if (this.drawing) {
            this.redraw = true;
            return;
        }

        this.drawing = true;

        this.div.innerHTML = '';
        let childDiv: HTMLElement;
        let renderer: Flow.Renderer;
        let context: Vex.IRenderContext;

        this.PrepareStaveRows();

        for (let i = 0; i < this.staveRows.length; i++) {
            childDiv = this.CreateAndGetDiv(this.div, this.subDivName + i.toString());
            renderer = new Flow.Renderer(childDiv, Flow.Renderer.Backends.SVG);
            renderer.resize(this.expectedScoreWidth, this.staveHeight * this.staveSlices[0].GetStaveDatas().length + 10);
            context = renderer.getContext();

            this.staveRows[i].SetDiv(childDiv);
            this.staveRows[i].SetStaveHeight(this.staveHeight);
            this.staveRows[i].Draw(context);
        }

        this.drawing = false;

        if (this.redraw) {
            this.redraw = false;
            this.Draw();
        }
    }

    CreateAndGetDiv(parentDiv, childDivName): HTMLElement {
        const divInnerHTML = '<div id="' + childDivName +  '"></div>';

        parentDiv.innerHTML += divInnerHTML;

        const ChildDiv = document.getElementById(childDivName);

        return ChildDiv;
    }
}
