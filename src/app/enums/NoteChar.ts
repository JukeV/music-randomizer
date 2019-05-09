import { Utils } from '../classes/utils';
export enum NoteChar {
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    A = 'A',
    B = 'B'
}

export namespace NoteChar {
  export function values() {
    return Utils.EnumStringValues(NoteChar);
  }
}
