import { Utils } from '../classes/utils';

export enum NoteDuration {

  Whole = 'w',
  Half = 'h',
  Quarter = 'q',
  Eight = '8',
  Sixteenth = '16',
  ThirtySecond = '32',
  SixtyFourth = '64'

}

export namespace NoteDuration {
  export function values() {
    return Utils.EnumStringValues(NoteDuration);
  }
}
