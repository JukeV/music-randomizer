import * as math from 'mathjs';

export class Utils {
    
    constructor() { }

    static MakeNumberArray(min = 0, max = 10): number[] {
        const arr = [];
        for (let i = min; i <= max; i++) {
            arr.push(i);
        }

        return arr;
    }

    static GetRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        max = max + 1;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static SumFractionArray (fractions: math.Fraction[]): math.Fraction {
        let sum = math.fraction(0);

        for (let i = 0; i < fractions.length; i++) {
            const value = fractions[i];

            sum = math.add(sum, value) as math.Fraction;
        }

        return sum as math.Fraction;
    }

    static GetRandomItemFromArray(array = []) {
        if (array.length === 0) {
            return null;
        }

        return array[Utils.GetRandomInt(0, array.length - 1)];
    }

    static GetRandomItemsFromArray(array = []) {
        const retArray = [];

        for (let i = 0; i < array.length; i++) {
            const rand = Utils.GetRandomInt(0, 1);

            if (rand === 1) {
                retArray.push(array[i]);
            }
        }

        return retArray;
    }

    static ShuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    static SplitFractionToDenominators(duration: math.Fraction): math.Fraction[] {
        const splitDurations = [];

        let remainingDuration = duration;

        while (math.compare(remainingDuration, math.fraction(0)) == 1) {
            const newDuration = math.fraction(1, remainingDuration.d);

            splitDurations.push(newDuration);

            remainingDuration = math.subtract(remainingDuration, newDuration) as math.Fraction;
        }

        return splitDurations;
    }    

    static GetRadioButtonValue(elementName: string): string {
        const radios = document.getElementsByName(elementName);

        for (let i = 0; i < radios.length; i++) {
            if ((radios[i] as HTMLInputElement).checked) {
                return (radios[i] as HTMLInputElement).value;
            }
        }

        return '';
    }
    
    static GetAvailableWidth(): number {
        const innerWidth = window.innerWidth;

        return innerWidth;
    }

    static RandomWeightedValue(values = [], weights = []) {
        if (values.length !== weights.length) {
            return null;
        }
        
        const weightSum = weights.reduce(
            (sum, value) => {
                return sum + value
            }            
        );

        const random = Utils.GetRandomInt(1, weightSum);

        let value = 0;

        for (let i = 0; i < weights.length; i++) {
            value = value + weights[i];

            if (random <= value) {
                return values[i];
            }
        }

        return null;
    }

    static RotateArray(arr: any[], count: number){        
        let retArr: any[];

        let firstPart: any[];
        let secondPart: any[];

        firstPart = arr.slice(count, arr.length);
        secondPart = arr.slice(0, count - 1);

        retArr = firstPart.concat(secondPart);        
        
        return retArr;
    }

    static EnumStringValues(KeyType): string[] {
      return Object.values(KeyType).filter(
        (type) => {
          if (typeof type === 'string') {
            return true;
          }
        }
      ) as string[];
    }

    static EnumNumberVales(KeyType) {
        return Object.keys(KeyType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }

    /*
    static IsUndefinedOrNull(value: any): boolean{
        if(value === undefined || value === null){
            return true;
        } else {
            return false;
        }
    }
    */
}
