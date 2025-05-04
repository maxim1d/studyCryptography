import {TypeRead, RleMethod} from "./rleMethod.js";
import {HuffmanMethod} from "./huffmanMethod.js";
import {ArithmeticMethod} from "./arithmeticMethod.js";

let currentFile = null;
let currentJsonFile = null;
const sizeBefore = document.getElementById("size-before-huff");
const sizeAfter = document.getElementById("size-after-huff");

const radioHuffman = document.querySelector('[name="method"][id="huffman"]')
const radioArithmetic = document.querySelector('[name="method"][id="arithmetic"]')

document.getElementById("input-file-huff").addEventListener(
    "change",
    async (e) => {
        currentFile = e.target.files[0];
        console.log(await RleMethod.readFile(currentFile, TypeRead.Text));
});

document.getElementById("input-json-huff").addEventListener(
    "change",
    async (e) => {
        currentJsonFile = e.target.files[0];
    });

document.getElementById("compress-huffman").addEventListener("click", async () => {
    if (currentFile !== null) {
        if (radioHuffman.checked) {
            await compressHuffman();
        } else if (radioArithmetic.checked) {
            await compressArithmetic();
        }
    } else {
        console.error("File not found.");
    }
});

document.getElementById("decompress-huffman").addEventListener('click', async () => {
    if (currentFile !== null) {
        if (currentJsonFile !== null) {
            if (radioHuffman.checked) {
                await decompressHuffman();
            } else if (radioArithmetic.checked) {
                await decompressArithmetic();
            }
        } else {
            console.error("File JSON-formated not found.");
        }
    } else {
        console.error("File txt-formated not found.");
    }
});

async function compressArithmetic() {
    let stringFromFile = await RleMethod.readFile(currentFile, TypeRead.Text);
    let dictionary = HuffmanMethod.toDictionaryFromString(stringFromFile);
    let weight = ArithmeticMethod.compress(stringFromFile, dictionary);
    sizeBefore.innerText = "Размер файла(ов) до: " + currentFile.size + "B";
    sizeAfter.innerHTML = "Размер файла(ов) после: " + weight + "B";
}

async function decompressArithmetic() {
    let bufferFromFile = await RleMethod.readFile(currentFile, TypeRead.Buffer);
    let jsonFromFile = await RleMethod.readFile(currentJsonFile, TypeRead.JSON);
    let dict = JSON.parse(jsonFromFile);
    let weight = ArithmeticMethod.decompress(bufferFromFile, dict);
    sizeBefore.innerText = "Размер файла(ов) до: " + (currentFile.size + currentJsonFile.size) + "B";
    sizeAfter.innerHTML = "Размер файла(ов) после: " + weight + "B";
}

async function compressHuffman() {
    let stringFromFile = await RleMethod.readFile(currentFile, TypeRead.Text);
    let node = HuffmanMethod.toTreeFromDictionary(
        HuffmanMethod.toDictionaryFromString(stringFromFile));
    let weight = HuffmanMethod.compress(stringFromFile, node);
    HuffmanMethod.fileWithCodesOfAllSymbols(node);
    sizeBefore.innerText = "Размер файла(ов) до: " + currentFile.size + "B";
    sizeAfter.innerHTML = "Размер файла(ов) после: " + weight + "B";
}

async function decompressHuffman() {
    let bufferFromFile = await RleMethod.readFile(currentFile, TypeRead.Buffer);
    let uint8array = new Uint8Array(bufferFromFile);
    let jsonFromFile = await RleMethod.readFile(currentJsonFile, TypeRead.Text);
    let dict = JSON.parse(jsonFromFile);
    let weight = HuffmanMethod.decompress(uint8array, dict);
    sizeBefore.innerText = "Размер файла(ов) до: " + (currentFile.size + currentJsonFile.size) + "B";
    sizeAfter.innerHTML = "Размер файла(ов) после: " + weight + "B";
}