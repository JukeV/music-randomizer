import { Component, OnInit, OnDestroy } from '@angular/core';

import { fromEvent, Observable, Subscription } from 'rxjs';

import { MusicScore } from '../classes/MusicScore';
import { MusicUtils } from '../classes/MusicUtils';
import { MelodicChordRandomizer } from '../classes/MelodicChordRandomizer';
import { HarmonicChordRandomizer } from '../classes/HarmonicChordRandomizer';
import { Utils } from '../classes/utils';

import { TrueFalseRandom } from '../enums/TrueFalseRandom';
import { ChordType } from '../enums/ChordType';
import { ClefType } from '../enums/ClefType';
import { KeySignatureCode } from '../enums/KeySignatureCode';
import { Note } from '../classes/Note';
import { NoteChar } from '../enums/NoteChar';

@Component({
  selector: 'app-chords',
  templateUrl: './chords.component.html',
  styleUrls: ['./chords.component.scss'],
})
export class ChordsComponent implements OnInit, OnDestroy {

  localStorageId = 'ChordOptions';

  scoreDiv = 'MusicScore';

  score: MusicScore;

  keySignatureList = [
    { value: 'random', description: 'Random'},
    { value: KeySignatureCode.C, description: 'C Major / A Minor'},
    { value: KeySignatureCode.G, description: 'G Major / E Minor'},
    { value: KeySignatureCode.D, description: 'D Major / B Minor'},
    { value: KeySignatureCode.A, description: 'A Major / F# Minor'},
    { value: KeySignatureCode.E, description: 'E Major / C# Minor'},
    { value: KeySignatureCode.B, description: 'B Major / G# Minor'},
    { value: KeySignatureCode.FSharp, description: 'F# Major / D# Minor'},
    { value: KeySignatureCode.CSharp, description: 'C# Major / A# Minor'},
    { value: KeySignatureCode.F, description: 'F Major / D Minor'},
    { value: KeySignatureCode.BFlat, description: 'Bb Major / G Minor'},
    { value: KeySignatureCode.EFlat, description: 'Eb Major / C Minor'},
    { value: KeySignatureCode.AFlat, description: 'Ab Major / F Minor'},
    { value: KeySignatureCode.DFlat, description: 'Db Major / Bb Minor'},
    { value: KeySignatureCode.GFlat, description: 'Gb Major / Eb Minor'},
    { value: KeySignatureCode.CFlat, description: 'Cb Major / Ab Minor'}
  ];

  clefTypeList = ClefType.descriptorList;

  showGrandStaffBassOption = true;

  practiceStaveCount = 20;

  keySignature = 'C';

  clef = ClefType.GrandStaff;

  grandStaffBassOption = 'double';

  melodicHarmonic = ChordType.Harmonic;
  chordType = ChordType;

  trueFalseRandom = TrueFalseRandom;

  inversions = false;

  omitNotes = TrueFalseRandom.True;

  sliderRange = ['5', '7'];

  sliderConfig: any = {
    start: [this.sliderRange[0], this.sliderRange[1]],
    connect: true,
    range: {
        'min': 5,
        'max': 13
    },
    step: 2,
    pips: {
        mode: 'positions',
        values: [0, 25, 50, 75, 100],
        stepped: true,
        density: 20
    }
  };

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor() { }

  ngOnInit() {

      this.UpdateFromLocalStorage();

      this.onClefChange();

      this.resizeObservable$ = fromEvent(window, 'resize');
      this.resizeSubscription$ = this.resizeObservable$.subscribe( this.WindowOnResize.bind(this) );
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  onClefChange() {
    if (this.clef === 'grand') {
      this.showGrandStaffBassOption = true;
    } else {
      this.showGrandStaffBassOption = false;
    }
  }

  WindowOnResize() {
    if (typeof(this.score) === 'undefined') {
      return;
    }

    const availableWidth = Utils.GetAvailableWidth();
    this.score.SetExpectedScoreWidth(availableWidth);
    this.score.Draw();
  }

    makeChords() {
        let keySignature: string;

        if (this.keySignature === 'random') {
            keySignature = MusicUtils.GetRandomKeySignature();
        } else {
            keySignature = this.keySignature;
        }

        const minChordSize = parseInt(this.sliderRange[0], undefined);
        const maxChordSize = parseInt(this.sliderRange[1], undefined);

        let chordType = this.melodicHarmonic

        let randomizer: HarmonicChordRandomizer | MelodicChordRandomizer;

        if (chordType === ChordType.Harmonic) {
            randomizer = new HarmonicChordRandomizer();
        } else if (chordType === ChordType.Melodic) {
            randomizer = new MelodicChordRandomizer();
        }

        randomizer.SetStaveAmount(this.practiceStaveCount);

        randomizer.SetInversions(this.inversions);

        randomizer.SetChordSizeRange(minChordSize, maxChordSize);

        randomizer.SetOmitNotes(this.omitNotes);

        const chordContainers = [];

        if (this.clef === ClefType.GrandStaff) {
            if (this.grandStaffBassOption === 'double') {
                const upperClef = ClefType.Treble;
                const lowerClef = ClefType.Bass;

                randomizer.SetNoteRange(new Note(NoteChar.C, 4), new Note(NoteChar.C, 6));                
                randomizer.Create();
                const trebleContainer = randomizer.GetChordContainer();
                trebleContainer.SetClefType(upperClef);
                chordContainers.push(trebleContainer);

                const bassContainer = MusicUtils.TransposeChordContainer(trebleContainer, -14);
                bassContainer.SetClefType(lowerClef);
                chordContainers.push(bassContainer);
            } else if (this.grandStaffBassOption === 'different') {
                randomizer.SetNoteRange(new Note(NoteChar.C, 4), new Note(NoteChar.C, 6));                
                randomizer.Create();
                const trebleContainer = randomizer.GetChordContainer();
                trebleContainer.SetClefType(ClefType.Treble);
                chordContainers.push(trebleContainer);

                randomizer.SetNoteRange(new Note(NoteChar.C, 2), new Note(NoteChar.C, 4));                
                randomizer.Create();
                const bassContainer = randomizer.GetChordContainer();  
                bassContainer.SetClefType(ClefType.Bass);
                chordContainers.push(bassContainer);
            }
        } else {
            const limits = MusicUtils.GetClefLimits(this.clef);
            randomizer.SetNoteRange(limits.min, limits.max);

            randomizer.Create();
            const container = randomizer.GetChordContainer();
            container.SetClefType(this.clef);
            chordContainers.push(container);
        }

        this.score = new MusicScore();

        const div = document.getElementById(this.scoreDiv);
        this.score.SetDiv(div);

        this.score.SetKeySignature(keySignature as KeySignatureCode);

        const availableWidth = Utils.GetAvailableWidth();
        this.score.SetExpectedScoreWidth(availableWidth);

        this.score.CreateStaveSlicesFromChordContainers(chordContainers);

        this.score.Draw();

        this.UpdateLocalStorage();
    }

  resetSelections() {
    localStorage.removeItem(this.localStorageId);

    window.location.reload();
  }

  UpdateLocalStorage() {
    const localStorageValues = {
      practiceStaveCount: this.practiceStaveCount,
      keySignature: this.keySignature,
      clef: this.clef,
      grandStaffBassOption: this.grandStaffBassOption,
      melodicHarmonic: this.melodicHarmonic,
      inversions: this.inversions,
      omitNotes: this.omitNotes,
      sliderRange: this.sliderRange
    };

    const jsonLocalStorageValues = JSON.stringify(localStorageValues);
    localStorage.setItem(this.localStorageId, jsonLocalStorageValues);
  }

  UpdateFromLocalStorage() {

    if (localStorage.getItem(this.localStorageId) === null) {
      return;
    }
    const jsonLocalStorageValues = localStorage.getItem(this.localStorageId);
    const localStorageValues = JSON.parse(jsonLocalStorageValues);

    this.practiceStaveCount = localStorageValues.practiceStaveCount;
    this.keySignature = localStorageValues.keySignature;
    this.clef = localStorageValues.clef;
    this.grandStaffBassOption = localStorageValues.grandStaffBassOption;
    this.melodicHarmonic = localStorageValues.melodicHarmonic;
    this.inversions = localStorageValues.inversions;
    this.omitNotes = localStorageValues.omitNotes;
    this.sliderRange = localStorageValues.sliderRange;
  }

}
