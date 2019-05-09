import { PracticeType } from '../enums/PracticeType';

export class StaveCreationData {

    practiceType = PracticeType.Melody;
    clef = 'treble';
    minOctave = 4;
    maxOctave = 5;
    inversions = false;

    constructor() {
    }

    SetPracticeType(practiceType = PracticeType.Melody) {
        this.practiceType = practiceType;
    }

    GetPracticeType() {
        return this.practiceType;
    }

    SetClef(clef = 'treble') {
        this.clef = clef;
    }

    GetClef() {
        return this.clef;
    }

    SetMinOctave(value = 4) {
        this.minOctave = value;
    }

    SetMaxOctave(value = 5) {
        this.maxOctave = value;
    }

    GetMinOctave() {
        return this.minOctave;
    }

    GetMaxOctave() {
        return this.maxOctave;
    }

    SetInversions(value = false) {
        this.inversions = value;
    }

    GetInversions() {
        return this.inversions;
    }
}
