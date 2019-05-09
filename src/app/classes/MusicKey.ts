import { KeyType } from '../enums/KeyType';
import { Note } from './Note';

import { KeySignatureCode } from '../enums/KeySignatureCode';
import { NoteChar } from '../enums/NoteChar';

export class MusicKey {

    public rootNote: Note = new Note();
    public keyType = KeyType.Major;
    constructor() {

    }

    SetRootNote(value: Note): void {
        this.rootNote = value;
    }

    GetRootNote(): Note {
        return this.rootNote;
    }

    SetKeyType(value = KeyType.Major): void {
        this.keyType = value;
    }

    GetKeyType(): KeyType {
        return this.keyType;
    }

    GetKeySignatureCharacter(): string {
        return this.KeySignatureToKeySignatureCharacter(this.rootNote, this.keyType);        
    }

    private KeySignatureToKeySignatureCharacter(root: Note, keyType: KeyType): KeySignatureCode{
        
        if( keyType === KeyType.Minor){
            return this.GetMinorKeySignature(root);
        } else {
            return this.GetMajorKeySignature(root);
        }
    }
    
    private GetMinorKeySignature(root: Note): KeySignatureCode{
        let keySignatureCode = KeySignatureCode.C;
        const rootNoteChar = root.GetNote();
        const sharpsFlats = root.GetSharpsFlats();

        switch(rootNoteChar) {
            case NoteChar.C: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.EFlat;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.E;
                }
                break;
            }
            case NoteChar.D: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.F;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.FSharp;
                } 
                break;
            }
            case NoteChar.E: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.G;                    
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.GFlat;
                } 
                break;
            }
            case NoteChar.F: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.AFlat;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.A;
                } 
                break;
            }
            case NoteChar.G: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.BFlat;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.B;
                } 
                break;
            }
            case NoteChar.A: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.C;
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.CSharp;
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.CFlat;
                } 
                break;
            }
            case NoteChar.B: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.D;
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.DFlat;
                } 
                break;
            }
        }
        return keySignatureCode;
    }

    private GetMajorKeySignature(root: Note): KeySignatureCode{
        let keySignatureCode = KeySignatureCode.C;
        const rootNoteChar = root.GetNote();
        const sharpsFlats = root.GetSharpsFlats();

        switch(rootNoteChar) {
            case NoteChar.C: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.C;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.CSharp;
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.CFlat;
                } 
                break;
            }
            case NoteChar.D: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.D;                    
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.DFlat;
                } 
                break;
            }
            case NoteChar.E: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.E;                    
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.EFlat;
                } 
                break;
            }
            case NoteChar.F: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.F;                    
                } else if (sharpsFlats === 1) {
                    keySignatureCode = KeySignatureCode.FSharp;
                } 
                break;
            }
            case NoteChar.G: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.G;                    
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.GFlat;
                } 
                break;
            }
            case NoteChar.A: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.A;
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.AFlat;
                } 
                break;
            }
            case NoteChar.B: {
                if( sharpsFlats === 0) {
                    keySignatureCode = KeySignatureCode.B;
                } else if (sharpsFlats === -1) {
                    keySignatureCode = KeySignatureCode.BFlat;
                } 
                break;
            }
        }

        return keySignatureCode;
    }
    
}
