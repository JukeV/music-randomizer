import { Utils } from '../classes/utils';
export enum HarmonizationType {
  Note,
  OneFourFive,
  OneFourFiveAlternativeInversions,
  Chord/* , 
  Melody */
}

export namespace HarmonizationType {
  export function values() {
    return Utils.EnumNumberVales(HarmonizationType);
  }

  export const descriptorList = [
    { value: HarmonizationType.Note, description: 'Notes' }, 
    { value: HarmonizationType.OneFourFive, description: '1st, 4th and 5th degree chords' }, 
    { value: HarmonizationType.Chord, description: 'Chords' }, 
    // { value: HarmonizationType.Chord, description: 'Melody' }
  ]
    
  
}
