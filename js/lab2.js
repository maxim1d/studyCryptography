import {RleMethod} from "./rleMethod.js";

const elementSizeBefore = document.getElementById("size-before-rle");
const elementSizeAfter = document.getElementById("size-after-rle");
const inputFile = document.getElementById("input-file");
const canvas = document.getElementById("icon-canvas");
const workOnFile = new RleMethod();

inputFile.addEventListener('change', (e) => {
    workOnFile.setFile(e.target.files[0]);
    elementSizeBefore.innerHTML = "Размер файла до: " + workOnFile.getFile().size + " B";
    elementSizeAfter.innerHTML = "Размер файла после: 0";
});


document.getElementById('create-icon').addEventListener('click', () => {
    workOnFile.createIcon();
});

document.getElementById('show-icon').addEventListener('click', async () => {
   await workOnFile.showIcon(canvas);
});

document.getElementById('compress-icon').addEventListener('click', async () => {
    elementSizeAfter.innerHTML = "Размер файла после: " +
        await workOnFile.compressIcon() + " B";
});

document.getElementById('decompress-icon').addEventListener('click', async () => {
    elementSizeAfter.innerHTML = "Размер файла после: " +
        await workOnFile.decompressIcon(canvas) + " B";
});
