import { Utils } from '../classes/utils';
export enum MelodicChordDirection {
  Ascending = 1,
  Descending,
  Random
}

export namespace MelodicChordDirection {
  export function values() {
    return Utils.EnumStringValues(MelodicChordDirection);
  }
}
