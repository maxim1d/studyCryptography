import {HuffmanMethod} from "./huffmanMethod.js";
import {RleMethod, TypeWrite} from "./rleMethod.js";

export class LzwMethod {
    static toDictionaryFromString(string) {
        let dictionary = {};
        let currentCode = 0;
        for (let symbol of string) {
            if (dictionary[symbol] === undefined) {
                dictionary[symbol] = currentCode;
                currentCode++;
            }
        }
        return dictionary;
    }

    static getLastCodeFromDictionary(dictionary) {
        let currentCode;
        for (let symbol in dictionary) {
            currentCode = dictionary[symbol];
        }
        return currentCode;
    }

    static compress(string, dictionary) {
        let arrayCompressed = [];
        let currentSubstring = "";
        let currentCode = this.getLastCodeFromDictionary(dictionary) + 1;
        for (let index = 0; index < string.length; index++) {
            let code = dictionary[currentSubstring + string[index]];
            if (code === undefined) {
                arrayCompressed.push(dictionary[currentSubstring]);
                dictionary[currentSubstring + string[index]] = currentCode;
                currentCode++;
                currentSubstring = string[index];
                if (string.length === index + 1) {
                    arrayCompressed.push(dictionary[currentSubstring]);
                }
            } else {
                currentSubstring = currentSubstring + string[index];
                if (string.length === index + 1) {
                    arrayCompressed.push(dictionary[currentSubstring]);
                }
            }
        }
        // return arrayCompressed;
        let maxNumber = 0;
        for (let el of arrayCompressed) {
            if (el > maxNumber) {
                maxNumber = el;
            }
        }
        let uint16array = new Uint16Array(arrayCompressed.length);
        for (let index = 0; index < arrayCompressed.length; index++) {
            uint16array[index] = arrayCompressed[index];
        }
        // console.log("Изначальный массив: ", arrayCompressed);
        // console.log("Сжатый массив: ", uint16array);
        let weight = RleMethod.downloadFile("compressed_file_LZW.txt", uint16array);
        let jsonString = JSON.stringify(this.toDictionaryFromString(string));
        weight += RleMethod.downloadFile("dictionary_to_LZW.json", jsonString, TypeWrite.JSON);
        return weight;
    }

    static decompress(compressed, dictionary) {
        compressed = new Uint16Array(compressed.buffer);
        console.log("Разжатый массив: ", compressed);
        let decompressedString = "";
        let currentSubstring = "";
        let currentCode = this.getLastCodeFromDictionary(dictionary) + 1;
        for (let code of compressed) {
            let symbol = HuffmanMethod.getKeyByValue(dictionary, code);
            if (symbol === null) {

            } else {
                decompressedString += symbol;
                currentSubstring += symbol[0];
                if (dictionary[currentSubstring] === undefined) {
                    dictionary[currentSubstring] = currentCode;
                    currentCode++;
                    currentSubstring = symbol;
                }
            }
        }
        // return decompressedString;
        return RleMethod.downloadFile("decompressed_LZW.txt", decompressedString);
    }
}

// let string = "";
// let dictionary = LzwMethod.toDictionaryFromString(string);
// let compressedArray = LzwMethod.compress(string, dictionary);
// let decompressedString = LzwMethod.decompress(compressedArray, dictionary);
// console.log(decompressedString);
// if (decompressedString === string) {
//     console.log("Строки совпадают");
// }