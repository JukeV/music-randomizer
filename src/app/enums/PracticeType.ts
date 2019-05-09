import { Utils } from '../classes/utils';

export enum PracticeType {
  MelodiTriads,
  HarmonicTriads,
  Melody
}

export namespace PracticeType {
  export function values() {
    return Utils.EnumStringValues(PracticeType);
  }
}
