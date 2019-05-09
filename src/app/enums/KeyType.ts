import { Utils } from '../classes/utils';

export enum KeyType {
  Major = 'Major',
  Minor = 'Minor'
}

export namespace KeyType {
  export function values() {
      return Utils.EnumStringValues(KeyType);
  }
}
