import { Flow } from 'vexflow';
export class ExtendedNote extends Flow.StaveNote {
    tieForward = false;
    tieBackward = false;

    constructor(clef: string, keys: string[], duration: string, auto_stem: boolean) {
        super({clef: clef, keys: keys, duration: duration, auto_stem: auto_stem});
    }

    SetTieForward(value = true): void {
        this.tieForward = value;
    }

    GetTieForward(): boolean {
        return this.tieForward;
    }

    SetTieBackward(value = true): void {
        this.tieBackward = value;
    }

    GetTieBackward(): boolean {
        return this.tieBackward;
    }
}
