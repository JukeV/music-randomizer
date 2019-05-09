import { Utils } from '../classes/utils';

export enum KeySignatureCode {
  C = 'C',
  G = 'G',
  D = 'D',
  A = 'A',
  E = 'E',
  B = 'B',
  FSharp = 'F#',
  CSharp = 'C#',
  F = 'F',
  BFlat = 'Bb',
  EFlat = 'Eb',
  AFlat = 'Ab',
  DFlat = 'Db',
  GFlat = 'Gb',
  CFlat = 'Cb'
}

export namespace KeySignatureCode {
  export function values() {
    return Utils.EnumStringValues(KeySignatureCode);
  }
}
