import { Utils } from '../classes/utils';

export enum TrueFalseRandom {
  False = 'false',
  True = 'true',
  Random = 'random'
}

export namespace TrueFalseRandom {
  export function values() {
    return Utils.EnumStringValues(TrueFalseRandom);
  }
}
