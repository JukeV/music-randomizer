import { Utils } from '../classes/utils';

export enum ClefType {
  GrandStaff = 'grand',
  FrenchViolin = 'french',
  Treble = 'treble',
  Soprano = 'soprano',
  MezzoSoprano = 'mezzo-soprano',
  Alto = 'alto',
  Tenor = 'tenor',
  BaritoneC = 'baritone-c',
  BaritoneF = 'baritone-f',
  Bass = 'bass',
  SubBass = 'subbass'
}

export namespace ClefType {
  export function values() {
    return Utils.EnumStringValues(ClefType);
  }

  export const descriptorList = [
    { value: ClefType.GrandStaff, description: 'Grand Staff'},
    { value: ClefType.FrenchViolin, description: 'French violin'},
    { value: ClefType.Treble, description: 'Treble'},
    { value: ClefType.Soprano, description: 'Soprano'},
    { value: ClefType.MezzoSoprano, description: 'Mezzo soprano'},
    { value: ClefType.Alto, description: 'Alto'},
    { value: ClefType.Tenor, description: 'Tenor'},
    { value: ClefType.BaritoneC, description: 'Baritone C'},
    { value: ClefType.BaritoneF, description: 'Baritone F'},
    { value: ClefType.Bass, description: 'Bass'},
    { value: ClefType.SubBass, description: 'Sub bass'}
  ];
}
