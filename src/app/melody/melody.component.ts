import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { MusicUtils } from '../classes/MusicUtils';
import { Utils } from '../classes/utils';
import { KeySignatureCode } from '../enums/KeySignatureCode';
import { ClefType } from '../enums/ClefType';
import { MusicScore } from '../classes/MusicScore';
import { MelodyRandomizer } from '../classes/MelodyRandomizer';
import { SupportedKeys } from '../classes/SupportedKeys';
import { MelodyHarmonizer } from '../classes/MelodyHarmonizer';
import { HarmonizationType } from '../enums/HarmonizationType';
import { ChordContainer } from '../classes/ChordContainer';

import * as math from 'mathjs';
import { Note } from '../classes/Note';
import { NoteChar } from '../enums/NoteChar';

@Component({
  selector: 'app-melody',
  templateUrl: './melody.component.html',
  styleUrls: ['./melody.component.scss'],
})
export class MelodyComponent implements OnInit, OnDestroy {

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  score: MusicScore;

  scoreDiv = 'MusicScore';

  localStorageId = 'MelodyOptions';

  keySignature: string = SupportedKeys.keyList[0].id;

  practiceStaveCount = 20;    

  clef = ClefType.GrandStaff;

  clefTypeList = ClefType.descriptorList;

  keylist = SupportedKeys.keyList;

  showGrandStaffOption = true;

  grandStaffMelodyHand = 'right';

  harmonizationTypes = HarmonizationType.descriptorList;
  
  harmonizationType: HarmonizationType = HarmonizationType.Note;

  difficulty = 1;

  sliderConfig: any = {
    start: [this.difficulty],
    connect: true,
    range: {
        'min': 1,
        'max': 15
    },
    step: 1,
    pips: {
        // mode: 'positions',
        mode: 'steps',
        // values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        stepped: true,
        density: 20
    }
  };

  creationSettings = {
    melodyRange: {
      min: new Note(NoteChar.C, 4),
      max: new Note(NoteChar.C, 6)
    },
    harmonyRange: {
      min: new Note(NoteChar.C, 2),
      max: new Note(NoteChar.C, 4)
    },
    harmonyTempoRange: {
      min: math.fraction(1, 4), 
      max: math.fraction(1, 2)
    },
    melodyTempoRange: {
      min: math.fraction(1, 8), 
      max: math.fraction(1, 4)
    },
    harmonizationTypes: [ HarmonizationType.Note ]
  };

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

  WindowOnResize() {
    if (typeof(this.score) === 'undefined') {
      return;
    }

    const availableWidth = Utils.GetAvailableWidth();
    this.score.SetExpectedScoreWidth(availableWidth);
    this.score.Draw();
  }

  makeMelody () {
    const randomizer = new MelodyRandomizer();
    this.PrepareCreationSettings();

    if(this.clef === ClefType.GrandStaff) {      

      let melodyClef: ClefType;
      let harmonyClef: ClefType;
      

      if(this.grandStaffMelodyHand === 'left'){
        harmonyClef = ClefType.Treble;
        melodyClef = ClefType.Bass;
        
      } else {
        harmonyClef = ClefType.Bass;
        melodyClef = ClefType.Treble;        
      }

      const key = SupportedKeys.KeyIdToMusicKey(this.keySignature);

      randomizer.SetKey(key);
      randomizer.SetStaveAmount(this.practiceStaveCount);
      /*
      randomizer.SetMinNoteDuration(math.fraction(1, 4) as math.Fraction);
      randomizer.SetMaxNoteDuration(math.fraction(1, 2) as math.Fraction);
      */
      // randomizer.SetNoteLengthLimits(math.fraction(1, 16) as math.Fraction, math.fraction(1, 1) as math.Fraction);
      randomizer.SetNoteLengthLimits(this.creationSettings.melodyTempoRange.min as math.Fraction, this.creationSettings.melodyTempoRange.max as math.Fraction);

      /*
      const limits = MusicUtils.GetClefLimits(melodyClef);

      randomizer.SetNoteRange(limits.min, limits.max);      
      */
      randomizer.SetNoteRange(this.creationSettings.melodyRange.min, this.creationSettings.melodyRange.max);      

      // randomizer.SetNoteRange(limits.min, MusicUtils.TransposeNote(limits.max, -7));      
      
      randomizer.Create();

      const melodyContainer = randomizer.GetChordContainer();
      melodyContainer.SetClefType(melodyClef);

      const harmonizer = new MelodyHarmonizer();
      harmonizer.SetClef(harmonyClef);
      harmonizer.SetKey(key);
      // harmonizer.SetNoteLengthLimits(math.fraction(1, 16) as math.Fraction, math.fraction(1, 1) as math.Fraction);
      harmonizer.SetNoteLengthLimits(this.creationSettings.harmonyTempoRange.min as math.Fraction, this.creationSettings.harmonyTempoRange.max as math.Fraction);
      harmonizer.SetNoteRange(this.creationSettings.harmonyRange.min, this.creationSettings.harmonyRange.max);      
      harmonizer.SetMelody(melodyContainer);
      // harmonizer.AddHarmonizationType(this.harmonizationType);
      // harmonizer.AddHarmonizationType(this.creationSettings.harmonizationType);
      harmonizer.SetHarmonizationTypes(this.creationSettings.harmonizationTypes);
      harmonizer.Create();

      const harmonyContainer = harmonizer.GetChordContainer();
      harmonyContainer.SetClefType(harmonyClef);

      this.score = new MusicScore();

      const div = document.getElementById(this.scoreDiv);
      this.score.SetDiv(div);
      this.score.SetExpectedScoreWidth(Utils.GetAvailableWidth());    
      this.score.SetKeySignature(randomizer.GetKey().GetKeySignatureCharacter() as KeySignatureCode);

      let containerList: ChordContainer[] = [];

      if(melodyClef === ClefType.Treble){
        containerList.push(melodyContainer);
        containerList.push(harmonyContainer);
      } else {
        containerList.push(harmonyContainer);
        containerList.push(melodyContainer);
      }
      /*
      console.log('melody:' + MusicUtils.CalculateMusicTotalDuration(melodyContainer.GetChords()) );
      console.log('harmony:' + MusicUtils.CalculateMusicTotalDuration(harmonyContainer.GetChords()) );
      */
      this.score.CreateStaveSlicesFromChordContainers(containerList);

      

    } else { 
      randomizer.SetClef(this.clef);
      randomizer.SetKey(SupportedKeys.KeyIdToMusicKey(this.keySignature));
      randomizer.SetStaveAmount(this.practiceStaveCount);      

      const limits = MusicUtils.GetClefLimits(this.clef);

      randomizer.SetNoteRange(limits.min, limits.max);
      randomizer.SetNoteLengthLimits(math.fraction(1, 8) as math.Fraction, math.fraction(1, 2) as math.Fraction);
      
      randomizer.Create();

      this.score = new MusicScore();

      const div = document.getElementById(this.scoreDiv);
      this.score.SetDiv(div);
      this.score.SetExpectedScoreWidth(Utils.GetAvailableWidth());    
      this.score.SetKeySignature(randomizer.GetKey().GetKeySignatureCharacter() as KeySignatureCode);

      const container = randomizer.GetChordContainer();
      container.SetClefType(this.clef);
      this.score.CreateStaveSlicesFromChordContainers([container]);

    }

    this.score.Draw();

    this.UpdateLocalStorage();
  }

  resetSelections() {
    localStorage.removeItem(this.localStorageId);

    window.location.reload();
  }

  onClefChange () {
    if(this.clef === ClefType.GrandStaff) {
      this.showGrandStaffOption = true;
    } else {
      this.showGrandStaffOption = false;
    }
  }

  UpdateLocalStorage() {
    const localStorageValues = {
      practiceStaveCount: this.practiceStaveCount,
      keySignature: this.keySignature,
      clef: this.clef,
      grandStaffMelodyHand: this.grandStaffMelodyHand,
      harmonizationType: this.harmonizationType,
      difficulty: this.difficulty
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
    this.grandStaffMelodyHand = localStorageValues.grandStaffMelodyHand;
    this.harmonizationType = localStorageValues.harmonizationType;
    this.difficulty = localStorageValues.difficulty;
  }

  PrepareCreationSettings(){

    const key = SupportedKeys.KeyIdToMusicKey(this.keySignature);
    const rootNote = key.GetRootNote();

    let melodyBaseOctave: number;
    let harmonyBaseOctave: number;
    let rightHandMelody: boolean;
    
    // let melodyDirectionModifier: number;

    if(this.grandStaffMelodyHand === 'right'){
      melodyBaseOctave = 4;    
      // melodyDirectionModifier = 1;
      harmonyBaseOctave = 3;      
      rightHandMelody = true;
    } else {
      melodyBaseOctave = 3;      
      // melodyDirectionModifier = -1;
      harmonyBaseOctave = 4; 
      rightHandMelody = false;     
    }

    switch(this.difficulty) {
      case 1:
        let melodyMinNote = new Note(rootNote.GetNote(), melodyBaseOctave);
        let melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 4);
        let harmonyMinNote = new Note(rootNote.GetNote(), harmonyBaseOctave);
        let harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 4);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]          
        }
        break;
      case 2:        
        melodyMinNote = new Note(rootNote.GetNote(), melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        harmonyMinNote = new Note(rootNote.GetNote(), harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 4);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]
        }
        break;
      case 3:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 7);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]          
        }
        break;
      case 4:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        // harmonyMinNote = new Note(NoteChar.B, harmonyBaseOctave - 1);

        harmonyMinNote = MusicUtils.TransposeNote((new Note(rootNote.GetNote(), harmonyBaseOctave)), -1);
        if(rightHandMelody){
          // if(harmonyMinNote.GetNote() !== NoteChar.C){
          if(MusicUtils.CompareNotes(harmonyMinNote, new Note(NoteChar.C, 3)) === 1){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
          }
        } else {
          if(MusicUtils.CompareNotes(harmonyMinNote, new Note(NoteChar.D, 4)) === -1){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() + 1);
          }
        }

        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 8);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.OneFourFive ]          
        }
        break;
      case 5:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        // harmonyMinNote = new Note(NoteChar.B, harmonyBaseOctave - 1);
        harmonyMinNote = MusicUtils.TransposeNote((new Note(rootNote.GetNote(), harmonyBaseOctave)), -1);
        if(rightHandMelody){
          /*
          if(MusicUtils.CompareNotes(harmonyMinNote, new Note(NoteChar.A, 2)) === 1){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
          }
          */
          harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
        }
        
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 8);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.OneFourFiveAlternativeInversions ],
        }
        break;
      case 6:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        }       

        // harmonyMinNote = new Note(NoteChar.B, harmonyBaseOctave - 1);
        harmonyMinNote = MusicUtils.TransposeNote((new Note(rootNote.GetNote(), harmonyBaseOctave)), -1);
        if(rightHandMelody){
          // if(harmonyMinNote.GetNote() !== NoteChar.C){
          if(MusicUtils.CompareNotes(harmonyMinNote, new Note(NoteChar.C, 3)) === 1){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
          }
        } else {
          if(MusicUtils.CompareNotes(harmonyMinNote, new Note(NoteChar.D, 4)) === -1){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() + 1);
          }
        }
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 8);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.OneFourFive ]
        }
        break;
      
      case 7:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        }

        // harmonyMinNote = new Note(NoteChar.B, harmonyBaseOctave - 1);
        harmonyMinNote = MusicUtils.TransposeNote((new Note(rootNote.GetNote(), harmonyBaseOctave)), -1);
        if(rightHandMelody){
          /*
          if(harmonyMinNote.GetNote() !== NoteChar.C){
            harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
          }
          */
          harmonyMinNote.SetOctave(harmonyMinNote.GetOctave() - 1);
        }
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 8);        

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.OneFourFiveAlternativeInversions ]          
        }
        break;
      case 8:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 7);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Chord ]
        }
        break;
      case 9:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
        }
        harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 7);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Chord ]
        }
        break;
      case 10:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
          harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave - 1);
          harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 14);
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);          
          harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
          harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 14);
        }

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 2), 
            max: math.fraction(1, 1)
          },
          melodyTempoRange: {
            min: math.fraction(1, 4), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Chord ]
        }
        break;
      case 11:
        melodyMinNote = new Note(rootNote.GetNote(), melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 4);
        harmonyMinNote = new Note(rootNote.GetNote(), harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 4);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          melodyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]
        }
        break;
      case 12:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        harmonyMinNote = new Note(rootNote.GetNote(), harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 4);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          melodyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]
        }
        break;      
      case 13:
        melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
        melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 7);
        harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 7);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          melodyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]
        }
        break;
      case 14:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);
        }
        
        harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 7);

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          melodyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]          
        }
        break;
      case 15:
        if(rightHandMelody){
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);
          harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave - 1);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 14);
        } else {
          melodyMinNote = new Note(NoteChar.C, melodyBaseOctave - 1);
          melodyMaxNote = MusicUtils.TransposeNote(melodyMinNote, 14);
          harmonyMinNote = new Note(NoteChar.C, harmonyBaseOctave);
        harmonyMaxNote = MusicUtils.TransposeNote(harmonyMinNote, 14);
        }

        this.creationSettings = {
          melodyRange: {            
            min: melodyMinNote,
            max: melodyMaxNote
          },
          harmonyRange: {
            min: harmonyMinNote,
            max: harmonyMaxNote
          },
          harmonyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          melodyTempoRange: {
            min: math.fraction(1, 8), 
            max: math.fraction(1, 2)
          },
          harmonizationTypes: [ HarmonizationType.Note ]          
        }
        break;
    }   
    
  }

  test(){
    
  }
}
