import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'melodyDifficultyDescription'
})
export class MelodyDifficultyDescriptionPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    switch(value) {
      case 1:
        return 'Melody: Quarter and half notes. Harmony: Half and whole notes. Both hands in five finger position.';
      case 2:
        return 'Melody: Quarter and half notes in range of octave. Harmony: Half and whole notes in five finger position.';
      case 3:
        return 'Melody: Quarter and half notes. Harmony: Half and whole notes. Both hands in range of octave.';
      case 4:
        return 'Melody: Quarter and half notes in range of octave. Harmony: Half and whole notes. 1st, 4th and 5th degree chords.';
      case 5:
        return 'Melody: Quarter and half notes in range of octave. Harmony: Half and whole notes. 1st, 4th and 5th degree chords in alternative inversions.';
      case 6:
        return 'Melody: Quarter and half notes in range of 2 octaves. Harmony: Half and whole notes. 1st, 4th and 5th degree chords.';
      case 7:
        return 'Melody: Quarter and half notes in range of 2 octaves. Harmony: Half and whole notes. 1st, 4th and 5th degree chords in alternative inversions.';
      case 8:
        return 'Melody: Quarter and half notes in range of octave. Harmony: Half and whole note chords in range of octave.';
      case 9:
        return 'Melody: Quarter and half notes in range of 2 octaves. Harmony: Half and whole note chords in range of octave.';
      case 10:
        return 'Melody: Quarter and half notes in range of 2 octaves. Harmony: Half and whole notes chords in range of 2 octaves.';
      case 11:
        return 'Counterpoint like piece: Both hands from eight to half notes in five finger position.';
      case 12:
        return 'Counterpoint like piece: Both hands from eight to half notes. Melody hand has octave range, harmony hand in five finger position.';
      case 13:
        return 'Counterpoint like piece: Both hands from eight to half notes in octave range.';
      case 14:
        return 'Counterpoint like piece: Both hands from eight to half notes. Melody hand has 2 octave range, harmony hand has octave range.';
      case 15:
        return 'Counterpoint like piece: Both hands from eight to half notes with 2 octave range.';
    }

    return '';
  }
}
