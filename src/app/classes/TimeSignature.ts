import * as math from 'mathjs';

export class TimeSignature {
    nominator: number;
    denominator: number;
    constructor(nominator, denominator) {
        this.nominator = parseInt(nominator, undefined);
        this.denominator = parseInt(denominator, undefined);
    }

    GetTimeSignature(): string {
        return this.nominator + '/' + this.denominator;
    }

    GetFraction(): math.Fraction {
        return math.fraction(this.nominator, this.denominator) as math.Fraction;
    }
}
