import {RleMethod, TypeRead} from "./rleMethod.js";
import {RsaMethod} from "./rsaMethod.js";

let currentFile = null;

let publicKey = [5, 229991];
let privateKey = [45797, 229991];

const radioFromFile = document.querySelector('[name="sender"][id="file"]');
// const radioFromTextarea = document.querySelector('[name="sender"][id="radio-textarea"]');

const textareaBefore = document.getElementById("textarea-before");
const textareaAfter = document.getElementById("textarea-after");

document.getElementById("")

document.getElementById("input-file-rsa").addEventListener(
    "change",
    async (e) => {
        currentFile = e.target.files[0];
        // console.log(await RleMethod.readFile(currentFile, TypeRead.Text));
    });

document.getElementById("encrypt").addEventListener("click", async () => {
    if (radioFromFile.checked) {
        if (currentFile === null) {
            alert("Файл не загружен!");
            return;
        }
        let string = await RleMethod.readFile(currentFile, TypeRead.Text);
        textareaBefore.value = string;
        let encryptArray = RsaMethod.encrypt(string, publicKey);
        textareaAfter.value = encryptArray;
        await RleMethod.downloadFile("encrypt_RSA.txt", encryptArray);
    } else {
        if (textareaBefore.value.trim() === "") {
            alert("Введите текст!");
            return;
        }
        let string = textareaBefore.value;
        textareaAfter.value = RsaMethod.encrypt(string, publicKey);
    }
});

document.getElementById("decrypt").addEventListener("click", async () => {
    if (radioFromFile.checked) {
        if (currentFile === null) {
            alert("Файл не загружен!");
            return;
        }
        let buffer = await RleMethod.readFile(currentFile, TypeRead.Buffer);
        let uint32array = new Uint32Array(buffer);
        let decryptedString = RsaMethod.decrypt(uint32array, privateKey);
        textareaBefore.value = uint32array;
        textareaAfter.value = decryptedString;
        await RleMethod.downloadFile("decrypt_RSA.txt", decryptedString);
    } else {
        if (textareaBefore.value.trim() === "") {
            alert("Введите текст!");
            return;
        }
        let string = textareaBefore.value;
        let encryptedArray = string.split(",").map(Number);
        let uint32array = new Uint32Array(encryptedArray.length);
        for (let index = 0; index < uint32array.length; index++) {
            uint32array[index] = parseInt(encryptedArray[index]);
        }
        textareaAfter.value = RsaMethod.decrypt(uint32array, privateKey);
    }
});

