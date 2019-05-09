import { ChordRandomizer } from './ChordRandomizer';
import { ChordContainer } from './ChordContainer';
import { Utils } from './utils';
import { MusicUtils } from './MusicUtils';

import { TrueFalseRandom } from '../enums/TrueFalseRandom';

import * as math from 'mathjs';

export class HarmonicChordRandomizer extends ChordRandomizer {
    constructor() {
        super();
    }

    Create(): void {
        this.chords = [];
        this.chordContainer = new ChordContainer();

        const noteList = MusicUtils.GetNoteList(this.minNote, this.maxNote);

        const totalDuration = this.GetTotalDuration();

        const noteDurations = MusicUtils.GetRandomNoteDurations(this.minNoteDuration as math.Fraction, this.maxNoteDuration as math.Fraction, totalDuration);

        let measureRemaining = math.fraction(this.timeSignature.GetTimeSignature());

        for (let i = 0; i < noteDurations.length; i++) {
            const rootNote = Utils.GetRandomItemFromArray(noteList);

            const chordSize = MusicUtils.GetRandomChordSize(this.minChordSize, this.maxChordSize);

            let inversion = -1;

            let omitIntervals = [];

            if (this.omitNotes === TrueFalseRandom.True) {
                omitIntervals = MusicUtils.GetOmitsOfChordSize(chordSize);
            } else if (this.omitNotes === TrueFalseRandom.Random) {
                omitIntervals = MusicUtils.GetOmitsOfChordSize(chordSize);
                omitIntervals = Utils.GetRandomItemsFromArray(omitIntervals);
            }

            if (this.inversions) {
                const possibleInversions = MusicUtils.GetInversionIndexList(chordSize);

                inversion = possibleInversions[Utils.GetRandomInt(0, possibleInversions.length - 1)];
            }

            const noteDurationFraction = noteDurations[i];

            if (math.compare(noteDurationFraction, measureRemaining) == 1) {

                let noteDurationRemaining = noteDurationFraction;
                let noteDurationRoom = measureRemaining;

                const preparedDurations = [];

                while (math.compare(noteDurationRemaining, noteDurationRoom) == 1) {
                    const noteDuration = noteDurationRoom;

                    preparedDurations.push(noteDuration);

                    noteDurationRemaining = math.subtract(noteDurationRemaining, noteDuration) as math.Fraction;

                    noteDurationRoom = math.fraction(this.timeSignature.GetTimeSignature());
                }

                preparedDurations.push(noteDurationRemaining);

                let newDurations = [];

                for (let j = 0; j < preparedDurations.length; j++) {
                    newDurations = newDurations.concat(Utils.SplitFractionToDenominators(preparedDurations[j]));
                }

                for (let j = 0; j < newDurations.length; j++) {
                    let backwardTie = false;
                    let forwardTie = false;                    

                    if (j === 0) {
                        backwardTie = false;
                        forwardTie = true;
                    } else if (j === newDurations.length - 1) {
                        backwardTie = true;
                        forwardTie = false;
                    } else {
                        backwardTie = true;
                        forwardTie = true;
                    }               

                    const chord = MusicUtils.MakeHarmonicChord(
                          rootNote, chordSize, newDurations[j], inversion, omitIntervals, backwardTie, forwardTie
                    );

                    this.chords.push(chord);
                }

                const totalAddedNoteDuration = math.sum(newDurations);

                measureRemaining = math.subtract(measureRemaining, totalAddedNoteDuration) as math.Fraction;

                while (math.compare(measureRemaining, math.fraction(0)) != 1) {
                    measureRemaining = math.add(measureRemaining, math.fraction(this.timeSignature.GetTimeSignature())) as math.Fraction;
                }

            } else if (math.compare(noteDurationFraction, measureRemaining) == 0) {
                const chord = MusicUtils.MakeHarmonicChord(
                    rootNote, chordSize, noteDurations[i], inversion, omitIntervals, false, false
                );

                this.chords.push(chord);

                measureRemaining = math.fraction(this.timeSignature.GetTimeSignature());
            } else {
                const chord = MusicUtils.MakeHarmonicChord(
                    rootNote, chordSize, noteDurations[i], inversion, omitIntervals, false, false
                );

                this.chords.push(chord);

                measureRemaining = math.subtract(measureRemaining, noteDurationFraction) as math.Fraction;
            }
        }

        this.chordContainer.SetChords(this.chords);
        this.chordContainer.SetTimeSignature(this.timeSignature);
    }
}
