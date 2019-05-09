import { MusicKey } from './MusicKey';
import { KeyType } from '../enums/KeyType';
import { Note } from './Note';
import { NoteChar } from '../enums/NoteChar';

export class SupportedKeys {
    static keyList = [
        { description: 'C Major', id: 'C'}, 
        { description: 'G Major', id: 'G'}, 
        { description: 'D Major', id: 'D'}, 
        { description: 'A Major', id: 'A'}, 
        { description: 'E Major', id: 'E'}, 
        { description: 'B Major', id: 'B'}, 
        { description: 'F# Major', id: 'F#'}, 
        { description: 'C# Major', id: 'C#'}, 
        { description: 'F Major', id: 'F'}, 
        { description: 'Bb Major', id: 'Bb'}, 
        { description: 'Eb Major', id: 'Eb'}, 
        { description: 'Ab Major', id: 'Ab'}, 
        { description: 'Db Major', id: 'Db'}, 
        { description: 'Gb Major', id: 'Gb'}, 
        { description: 'Cb Major', id: 'Cb'},
        { description: 'A Minor', id: 'Am'},
        { description: 'E Minor', id: 'Em'}, 
        { description: 'B Minor', id: 'Bm'}, 
        { description: 'F# Minor', id: 'F#m'}, 
        { description: 'C# Minor', id: 'C#m'}, 
        { description: 'G# Minor', id: 'G#m'}, 
        { description: 'D# Minor', id: 'D#m'}, 
        { description: 'A# Minor', id: 'A#m'}, 
        { description: 'D Minor', id: 'Dm'}, 
        { description: 'G Minor', id: 'Gm'}, 
        { description: 'C Minor', id: 'Cm'}, 
        { description: 'F Minor', id: 'Fm'}, 
        { description: 'Bb Minor', id: 'Bbm'}, 
        { description: 'Eb Minor', id: 'Ebm'}, 
        { description: 'Ab Minor', id: 'Abm'}
    ]

    static KeyIdToMusicKey (value: string): MusicKey {
        const key = new MusicKey();
        let keyType = KeyType.Major;    
        const rootNote =  new Note();

        if(value.substring(value.length - 1) === 'm'){
        keyType = KeyType.Minor;
        value = value.substring(0, value.length - 1);
        } else {
        keyType = KeyType.Major;
        }
        
        if(value.substring(value.length - 1) === '#'){
        rootNote.SetSharpsFlats(1);
        value = value.substring(0, value.length - 1);
        }
        else if(value.substring(value.length - 1) === 'b'){
        rootNote.SetSharpsFlats(-1);
        value = value.substring(0, value.length - 1); 
        }

        rootNote.SetNote(value as NoteChar);

        key.SetRootNote(rootNote);
        key.SetKeyType(keyType);

        return key;
    }

    static MusicKeyToKeyId(value: MusicKey): string {
        const rootNote = value.GetRootNote();

        let keyId = rootNote.GetNote() as string;
        if(rootNote.GetSharpsFlats() < 0) {
            keyId = keyId + 'b';
        }
        else if (rootNote.GetSharpsFlats() > 0) {
            keyId = keyId + '#';
        }

        if(value.GetKeyType() === KeyType.Minor){
            keyId = + keyId + 'm';
        }

        return keyId;
    }    
}