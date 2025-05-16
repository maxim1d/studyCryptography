import {RleMethod, TypeWrite} from "./rleMethod.js";

class CharacterInterval {
    #left = null;
    #right = null;
    #value = null;
    constructor(value, left=null, right=null) {
        this.#left = left;
        this.#right = right;
        this.#value = value;
    }
    get left() {return this.#left; }
    get right() {return this.#right; }
    get value() {return this.#value; }
    get segment() { return `[${this.#left}:${this.#right})`; }
    get midpoint() {return this.#left + (this.#right - this.#left) * 0.5; }
    toString() { return `${this.#value} - ${this.segment}`; }
}

export class ArithmeticMethod {
    static DIFFERENCE = 6;
    static getCode(string, dictionaryOfProbabilities) {
        let currentInterval = new CharacterInterval(string, 0, 1);
        let currentDictionary = ArithmeticMethod.getNewBorders(currentInterval, dictionaryOfProbabilities);
        for (let currentSymbol of string) {
            // for (let symbol in currentDictionary) {
            //     console.log(currentDictionary[symbol].toString());
            // }
            // console.log(`Выбрали букву ${currentSymbol} с интервалом ${currentDictionary[currentSymbol].segment}`);
            currentInterval = currentDictionary[currentSymbol];
            currentDictionary = ArithmeticMethod.getNewBorders(currentInterval, dictionaryOfProbabilities);
        }
        return currentInterval.midpoint;
    }

    static getNewBorders(root, dict) {
        let dictionary = {};
        let countSymbols = 0;
        for (let symbol in dict) {
            countSymbols += dict[symbol];
        }
        let currentLeft = root.left;
        let currentRight = root.right;
        let cursor = currentLeft;

        for (let dictKey in dict) {
            let left = cursor;
            let interval = (dict[dictKey] / countSymbols) * (currentRight - currentLeft)
            let right = left + interval;
            dictionary[dictKey] = new CharacterInterval(dictKey, left, right);
            cursor += interval;
        }
        return dictionary;
    }

    static getStringFromCode(number, dictionaryOfProbabilities) {
        let currentInterval = new CharacterInterval("", 0, 1);
        let currentDictionary = ArithmeticMethod.getNewBorders(currentInterval, dictionaryOfProbabilities);
        let resultString = "";
        while (currentInterval.midpoint !== number) {
            for (let symbol in dictionaryOfProbabilities) {
                if (currentDictionary[symbol].left <= number && number <= currentDictionary[symbol].right) {
                    currentInterval = currentDictionary[symbol];
                    // console.log(`В интервал ${currentInterval.toString()} входит ${number}`);
                    resultString += symbol;
                }
            }
            currentDictionary = ArithmeticMethod.getNewBorders(currentInterval, dictionaryOfProbabilities);
        }
        return resultString;
    }

    static decompress(buffer, dictionaryOfProbabilities) {
        let arrayNumbers = ArithmeticMethod.readFloatsFromBinary(buffer);
        let resultString = "";
        for (let number of arrayNumbers) {
            resultString += ArithmeticMethod.getStringFromCode(number, dictionaryOfProbabilities);
        }
        return RleMethod.downloadFile("decompressed_Arithmetic", resultString);
    }

    static compress(string, dictionaryOfProbabilities) {
        let arrayCodes = []
        let currentPosition = 0;
        while (currentPosition < string.length) {
            let currentString = string.substring(currentPosition, currentPosition + this.DIFFERENCE);
            arrayCodes.push(ArithmeticMethod.getCode(currentString, dictionaryOfProbabilities));
            currentPosition += this.DIFFERENCE;
        }
        let float64array = ArithmeticMethod.saveFloatsToBinary(arrayCodes);
        let weight = RleMethod.downloadFile("compressed_Arithmetic", float64array);
        let jsonString = JSON.stringify(dictionaryOfProbabilities);
        weight += RleMethod.downloadFile("dictionary_for_Arithmetic.json", jsonString, TypeWrite.JSON);
        return weight;
    }
    static saveFloatsToBinary(numbers) {
        const buffer = new ArrayBuffer(numbers.length * 8);
        const float64array = new Float64Array(buffer);
        for (let i = 0; i < numbers.length; i++) {
            float64array[i] = numbers[i];
        }
        return float64array;
    }

    static readFloatsFromBinary(buffer) {
        const float64Array = new Float64Array(buffer);
        return Array.from(float64Array);
    }
}