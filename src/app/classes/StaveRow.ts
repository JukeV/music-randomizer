import { Flow } from 'vexflow';

import { Utils } from './utils';
import { StaveSlice } from './StaveSlice';

export class StaveRow {

    staveSlices: StaveSlice[] = [];
    widthScale: number = 1;
    expectedWidth: number = 1000;
    div: HTMLElement;
    staveHeight: number = 150;
    addTimeSignature: boolean = false;
    leftBuffer: number = 15;
    rightBuffer: number = 40;

    constructor() {

    }

    AddStaveSlice(slice: StaveSlice) {
        this.staveSlices.push(slice);
    }

    GetStaveSlices(): StaveSlice[] {
        return this.staveSlices;
    }

    SetWidthScale(scale: number) {
        this.widthScale = scale;
    }

    GetWidthScale(): number {
        return this.widthScale;
    }

    SetExpectedWidth(width: number) {
        this.expectedWidth = width;
    }

    GetExpectedWidth(): number {
        return this.expectedWidth;
    }

    SetDiv(div: HTMLElement) {
        this.div = div;
    }

    SetStaveHeight(value: number) {
        this.staveHeight = value;
    }

    AddTimeSignature(value: boolean) {
        this.addTimeSignature = value;
    }

    CalculateWidthScale(): void {
        const staveWidth = this.GetBaseWidth();

        this.widthScale = (this.expectedWidth - (this.leftBuffer + this.rightBuffer)) / staveWidth;
    }
    GetBaseWidth(): number {
        let totalWidth = 0;

        for (let i = 0; i < this.staveSlices.length; i++) {
            totalWidth += this.staveSlices[i].GetSliceBaseWidth();
        }

        return totalWidth;
    }

    DrawTies(context: Vex.IRenderContext) {
        for (let i = 0; i < this.staveSlices.length; i++) {
            const staveDatas = this.staveSlices[i].GetStaveDatas();

            const ties = [];

            for (let j = 0; j < staveDatas.length; j++) {
                const notes = staveDatas[j].GetStaveNotes();

                for (let k = 0; k < notes.length; k++) {
                    const indexList = Utils.MakeNumberArray(0, notes[k].getKeys().length - 1);

                    if (i === 0 && k === 0) {
                        if (notes[k].GetTieBackward() === true) {
                            ties.push(new Flow.StaveTie({
                                last_note: notes[k],
                                first_indices: indexList,
                                last_indices: indexList
                            }));
                        }
                    }

                    if (notes[k].GetTieForward() === true) {
                        if (typeof(notes[k + 1]) === 'undefined') {
                            if (typeof(this.staveSlices[i + 1]) === 'undefined') {
                                ties.push(new Flow.StaveTie({
                                    first_note: notes[k],
                                    first_indices: indexList,
                                    last_indices: indexList
                                }));
                            } else {
                                ties.push(new Flow.StaveTie({
                                    first_note: notes[k],
                                    last_note: this.staveSlices[i + 1].GetStaveDatas()[j].GetStaveNotes()[0],
                                    first_indices: indexList,
                                    last_indices: indexList
                                }));
                            }
                        } else {
                            ties.push(new Flow.StaveTie({
                                first_note: notes[k],
                                last_note: notes[k + 1],
                                first_indices: indexList,
                                last_indices: indexList
                            }));
                        }
                    }
                }
            }

            ties.forEach(function(t) {
                t.setContext(context).draw();
            });
        }
    }

    Draw(context) {
        this.CalculateWidthScale();
        let x = this.leftBuffer;

        for (let i = 0; i < this.staveSlices.length; i++) {
            if (i === this.staveSlices.length - 1) {
                this.staveSlices[i].UseScaledWidth(false);
                this.staveSlices[i].SetWidth(this.expectedWidth - x - this.rightBuffer);
            } else {
                this.staveSlices[i].UseScaledWidth(true);
                this.staveSlices[i].SetWidthScale(this.widthScale);
            }

            this.staveSlices[i].SetX(x);
            this.staveSlices[i].SetStaveHeight(this.staveHeight);
            this.staveSlices[i].SetDiv(this.div);
            this.staveSlices[i].Draw(context);

            x += this.staveSlices[i].GetScaledWidth();
        }

        this.DrawTies(context);
    }
}
