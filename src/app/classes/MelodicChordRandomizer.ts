import { ChordRandomizer } from './ChordRandomizer';
import { ChordContainer } from './ChordContainer';
import { Utils } from './utils';
import { MusicUtils } from './MusicUtils';
import { MelodicChordDirection } from '../enums/MelodicChordDirection';
import { TrueFalseRandom } from '../enums/TrueFalseRandom';

import * as math from 'mathjs';

export class MelodicChordRandomizer extends ChordRandomizer {

    direction = MelodicChordDirection.Ascending;

    constructor() {
        super();
    }

    SetChordDirection(direction = MelodicChordDirection.Ascending): void {
        this.direction = direction;
    }

    Create(): void {
        this.chords = [];
        this.chordContainer = new ChordContainer();

        const noteList = MusicUtils.GetNoteList(this.minNote, this.maxNote);

        const totalDuration = this.GetTotalDuration();

        let currentDuration = math.fraction(0);

        let direction;

        while (currentDuration <= totalDuration) {
            const rootNote = Utils.GetRandomItemFromArray(noteList);

            const chordSize = MusicUtils.GetRandomChordSize(this.minChordSize, this.maxChordSize);

            let omitIntervals = [];

            if (this.omitNotes === TrueFalseRandom.True) {
                omitIntervals = MusicUtils.GetOmitsOfChordSize(chordSize);
            } else if (this.omitNotes === TrueFalseRandom.Random) {
                omitIntervals = MusicUtils.GetOmitsOfChordSize(chordSize);
                omitIntervals = Utils.GetRandomItemsFromArray(omitIntervals);
            }

            let inversion = -1;

            if (this.inversions) {
                const possibleInversions = MusicUtils.GetInversionIndexList(chordSize);

                inversion = possibleInversions[Utils.GetRandomInt(0, possibleInversions.length - 1)];
            }

            if (this.direction = MelodicChordDirection.Random) {
                const rand = Utils.GetRandomInt(0, 1);

                if (rand) {
                    direction = MelodicChordDirection.Ascending;
                } else {
                    direction = MelodicChordDirection.Descending;
                }
            } else {
                direction = this.direction;
            }

            this.chords = this.chords.concat(
                MusicUtils.MakeMelodicChord(rootNote, chordSize, math.fraction(1, 4) as math.Fraction, direction, inversion, omitIntervals)
            );

            currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);
        }

        currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);

        while (math.compare(currentDuration, totalDuration) == 1) {
            this.chords = this.chords.slice(0, this.chords.length - 1);
            currentDuration = MusicUtils.CalculateMusicTotalDuration(this.chords);
        }

        this.chordContainer.SetChords(this.chords);
        this.chordContainer.SetTimeSignature(this.timeSignature);
    }
}
