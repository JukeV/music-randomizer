import { NoteRandomizerBaseClass } from './NoteRandomizerBaseClass';

import { TrueFalseRandom } from '../enums/TrueFalseRandom';
export class ChordRandomizer extends NoteRandomizerBaseClass {

    minChordSize = 5;
    maxChordSize = 5;
    omitNotes = TrueFalseRandom.False;

    constructor() {
        super();
    }

    SetChordSizeRange(minSize = 5, maxSize = 5): void {
        this.minChordSize = minSize;
        this.maxChordSize = maxSize;
    }

    SetOmitNotes(omit = TrueFalseRandom.False): void {
        this.omitNotes = omit;
    }
}
