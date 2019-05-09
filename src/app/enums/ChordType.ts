import { Utils } from '../classes/utils';
export enum ChordType {
  Melodic = 'melodic',
  Harmonic = 'harmonic',
  Both = 'both'
}

export namespace ChordType {
  export function values() {
    return Utils.EnumNumberVales(ChordType);
  }
}
