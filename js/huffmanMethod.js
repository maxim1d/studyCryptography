import {RleMethod, TypeWrite} from "./rleMethod.js";

export class HuffmanMethod {
    static toDictionaryFromString(string) {
        let dict = {};
        for (let symbol of string) {
            if (symbol in dict) {
                dict[symbol] += 1;
            } else {
                dict[symbol] = 1;
            }
        }
        return dict;
    }

    static toTreeFromDictionary(dictionary) {
        let dict = dictionary;
        let root = null;
        let dictNodes = {};

        for (let key in dict) {
            dictNodes[key] = new Node(key)
            dictNodes[key].weight = dict[key];
        }

        while (Object.keys(dict).length >= 2) {
            let keyMinimalFirst = HuffmanMethod.getKeyByValue(
                dict,
                Math.min(...Object.values(dict))
            );
            let nodeFirst = dictNodes[keyMinimalFirst];
            nodeFirst.weight = dict[keyMinimalFirst];
            delete dict[keyMinimalFirst];
            delete dictNodes[keyMinimalFirst];

            let keyMinimalSecond = HuffmanMethod.getKeyByValue(
                dict,
                Math.min(...Object.values(dict))
            );
            let nodeSecond = dictNodes[keyMinimalSecond];
            nodeSecond.weight = dict[keyMinimalSecond];
            delete dict[keyMinimalSecond];
            delete dictNodes[keyMinimalSecond];

            dict[keyMinimalFirst + keyMinimalSecond] = nodeFirst.weight + nodeSecond.weight;
            dictNodes[keyMinimalFirst + keyMinimalSecond] = new Node(
                keyMinimalFirst + keyMinimalSecond,
                nodeFirst,
                nodeSecond
            );
            dictNodes[keyMinimalFirst + keyMinimalSecond].weight = nodeFirst.weight + nodeSecond.weight;
            root = dictNodes[keyMinimalFirst + keyMinimalSecond];
        }
        return root;
    }

    static getKeyByValue(dict, value) {
        for (let key in dict) {
            if (dict[key] === value) return key;
        }
        return null;
    }

    static fileWithCodesOfAllSymbols(node) {
        let symbolsFromFile = node.value;
        let stringWithCodes = "Символы и их коды:\n";
        for (let symbol of symbolsFromFile) {
            if (symbol === '\n') {
                stringWithCodes += `"\\n" - ${node.find(symbol)};\n`;
            } else {
                stringWithCodes += `"${symbol}" - ${node.find(symbol)};\n`;
            }
        }
        RleMethod.downloadFile("codes of symbols", stringWithCodes);
    }

    static compress(string, node = null) {
        if (node === null || node === undefined) {
            node = HuffmanMethod.toTreeFromDictionary(
                HuffmanMethod.toDictionaryFromString(string));
        }
        let compressedString = "";
        for (let symbol of string) {
            compressedString += node.find(symbol);
        }
        let byteLength = 8;
        let numberLength = 4;
        let count = byteLength * 2 - numberLength - compressedString.length % byteLength;
        compressedString = RleMethod.addZero(count.toString(2), numberLength) +
            RleMethod.addZero(compressedString, compressedString.length + count);
        let arrayCompressed = [];
        let currentPos = 0;
        while (compressedString.length >= currentPos + byteLength) {
            arrayCompressed.push(
                parseInt(
                    compressedString.slice(currentPos, currentPos + byteLength),
                    2
                )
            );
            currentPos += byteLength;
        }
        let uint8array = new Uint8Array(arrayCompressed.length);
        for (let index = 0; index < arrayCompressed.length; index++) {
            uint8array[index] = arrayCompressed[index];
        }
        let weight = RleMethod.downloadFile("compressed_file_Huffman.txt", uint8array);
        let jsonString = JSON.stringify(HuffmanMethod.toDictionaryFromString(string));
        weight += RleMethod.downloadFile("dictionary.json", jsonString, TypeWrite.JSON);
        return weight;
    }

    static decompress(uint8array, dictionary) {
        let compressedString = "";
        for (let val of uint8array) {
            compressedString += RleMethod.addZero(val.toString(2), 8);
        }
        let countMiss = parseInt(compressedString.slice(0, 4), 2);
        compressedString = compressedString.slice(4 + countMiss);

        let node = HuffmanMethod.toTreeFromDictionary(dictionary);
        let currentNode = node;
        let decompressString = "";
        for (let symbol of compressedString) {
            if (symbol === Code.left && currentNode.left !== null) {
                currentNode = currentNode.left;
            } else if (symbol === Code.right && currentNode.right !== null) {
                currentNode = currentNode.right;
            }
            if (currentNode.left === null || currentNode.right === null) {
                decompressString += currentNode.value;
                currentNode = node;
            }
        }
        return RleMethod.downloadFile("decompressed.txt", decompressString);
    }
}

export class Code {
    static left = "0";
    static right = "1";
}

export class Node {
    #left = null;
    #right = null;
    #value = null;
    #weight = null;
    constructor(value, left=null, right=null) {
        this.#left = left;
        this.#right = right;
        this.#value = value;
    }
    set weight(weight) { this.#weight = weight; }
    get weight() { return this.#weight; }
    get left() { return this.#left; }
    get right() { return this.#right; }
    get value() { return this.#value; }
    find(value) { return this.#find(value, ""); }
    #find(value, returnValue) {
        if (this.left === null || this.right === null) {
            return returnValue;
        }
        if (this.left.value.includes(value)) {
            returnValue += Code.left;
            return this.left.#find(value, returnValue);
        } else if (this.right.value.includes(value)) {
            returnValue += Code.right;
            return this.right.#find(value, returnValue);
        }
    }
    toString() {
        let returnString = "";
        if (this.right !== null) { returnString += this.right.toString(); }
        if (this.left !== null) { returnString += this.left.toString(); }
        return "[Node] value: " + this.value.toString() + "\n" + returnString;
    }
}