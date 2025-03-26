// --- LR1 ---

function clickRadioBtn() {
    const randLang = document.getElementById('rand');
    if (randLang.checked) {
        document.getElementById('lr1_input__alphabet').classList.remove('invisible');
        document.getElementById('lr1_input__alphabet').classList.add('visible');
    } else {
        document.getElementById('lr1_input__alphabet').classList.add('invisible');
        document.getElementById('lr1_input__alphabet').classList.remove('visible');
    }
}




function btnClick() {   
    let text = document.getElementById('lr1_input').value;
    let alphabet; // регулярное выражение
    let N; // мощность алфавита
    if (document.getElementById('eng').checked) {
        console.log("eng language");
        N = 27;
        alphabet = /[a-z ]/gi; // "a-z " - латинские символы и пробел, g, i - флаги для учета символов любого регистра и во всей строке
    }
    else if (document.getElementById('rus').checked) {
        console.log("rus language");
        N = 34;
        alphabet = /[а-я ]/gi;
    } else {
        console.log("rand language");
        let alphabet_from_string = document.getElementById('lr1_input__alphabet').value;
        N = alphabet_from_string.length;
        alphabet = new RegExp("[" + alphabet_from_string + "]", "gi");
        console.log(alphabet);
    }
    console.log(Math.ceil(Math.log2(N)));

    let K;
    try {
        K = text.match(alphabet).length; // кол-во символов в сообщении
    } catch {
        K = 0;
    }
    let i  = Math.ceil(Math.log2(N)); // информационный вес одного символа
    let I = K * i; // информационный вес сообщения
    
    
    document.getElementById('lr1_weight').innerHTML="Информационный вес: " + I.toString();
    document.getElementById('lr1_power').innerHTML="Мощность: " + N.toString();
}

// --- LR 2 ---

const WIDTH_IMAGE = 100;
const HEIGHT_IMAGE = 100;
const NUMBER_PIXELS = WIDTH_IMAGE * HEIGHT_IMAGE;
const BLACK = 1;
const WHITE = 0;

const inputFile = document.getElementById("files");

inputFile.addEventListener('change', (e) => {  
    let file = e.target.files[0];
    document.getElementById("size_before").innerHTML = "Размер файла до: " + file.size + " B";
    document.getElementById("size_after").innerHTML = "Размер файла после: 0";
});

function CreateIcon() {
    let randomColorIcon = "";
    for (let count = 0; count < NUMBER_PIXELS; count++) {
        randomColorIcon += Math.round(Math.random()).toString();
    }
    DownloadFile("new_icon.txt", randomColorIcon);
}

async function ShowIcon() {
    let selectedFile = document.getElementById("files").files[0];
    let stringFromFile = await ReadFile(selectedFile, "text");

    const canvas = document.getElementById("canvas");
    canvas.width = WIDTH_IMAGE;
    canvas.height = WIDTH_IMAGE;
    const context = canvas.getContext("2d");
    const image = new Image(WIDTH_IMAGE, HEIGHT_IMAGE);
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0,0, image.width, image.height);
    for (let counter = 0; counter < imageData.data.length; counter+=4) {
        if (stringFromFile[Math.floor(counter / 4)].toString() === BLACK.toString()) {
            imageData.data[counter] = 0;
            imageData.data[counter + 1] = 0;
            imageData.data[counter + 2] = 0;
            imageData.data[counter + 3] = 255;
        } else {
            imageData.data[counter] = 255;
            imageData.data[counter + 1] = 255;
            imageData.data[counter + 2] = 255;
            imageData.data[counter + 3] = 255;
        }
    }
    context.putImageData(imageData, 0, 0);
}

function AddZero(string, count) {
    while (string.length < count) {
        string = "0" + string;
    }
    return string;
}

async function Compress() {
    let selectedFile = document.getElementById("files").files[0];
    let stringFromFile = await ReadFile(selectedFile, "text");
    let index = 1;
    let numberRepetitions = 0;
    let arrayCompressBinary = [];
    while (index <= stringFromFile.length) {
        if (stringFromFile[index - 1] === stringFromFile[index] && numberRepetitions < 127) {
            numberRepetitions++;
        } else {
            // старший бит - цвет "1" - черный, "0" - белый
            // далее 7 бит кол-ва повторений
            // Примеры:
            // "1111111" => повторение цвета "1" (Черный) 7 раз => 1(Черный) 0000111 (7 в двоичной с/с) => 10000111
            // "0" => повторение цвета "0" (Белый) 1 раз => 0(Белый) 0000001 (1 в двоичной с/с) => 00000001
            arrayCompressBinary.push(
                stringFromFile[index - 1] + AddZero((numberRepetitions + 1).toString(2), 7)
            );
            numberRepetitions = 0;
        }
        index++;
    }

    let arrayCompressDecimal = [];
    for (let index = 0; index < arrayCompressBinary.length; index++) {
        arrayCompressDecimal[index] = parseInt(arrayCompressBinary[index], 2);
    }

    // преобразование массива в байт-массив и потом в файл
    let uint8array = new Uint8Array(arrayCompressDecimal.length);
    for (let index = 0; index < arrayCompressDecimal.length; index++) {
        uint8array[index] = arrayCompressDecimal[index];
    }

    document.getElementById("size_after").innerHTML = "Размер файла после: " + uint8array.length + " B";

    DownloadFile("2.txt", uint8array);
}

function ReadFile(file, type) {
    return new Promise(function(resolve) {
        let stringsFromFile;
        let reader = new FileReader();
        reader.onload = function() {
            stringsFromFile = reader.result;
            resolve(stringsFromFile);
        }
        switch(type) {
            case "buffer":
                reader.readAsArrayBuffer(file);
                break;
            case "text":
                reader.readAsText(file);
                break;
            default:
                reader.readAsText(file);
                break;
        }
    });
}

function MultiplicationRows(string, count) {
    let outString = "";
    for (let index = 0; index < count; index++) {
        outString += string;
    }
    return outString;
}

async function Decompress() {
    let selectedFile = document.getElementById("files").files[0];
    let bufferFromFile = await ReadFile(selectedFile, "buffer");
    let uint8array = new Uint8Array(bufferFromFile);

    let binaryArray = [];
    for (let i = 0; i < uint8array.length; i++) {
        binaryArray.push(AddZero(uint8array[i].toString(2), 8));
    }

    let stringForFile = "";
    for (let index = 0; index < binaryArray.length; index++) {
        stringForFile += MultiplicationRows(
            binaryArray[index][0].toString(),
            parseInt(binaryArray[index].slice(1), 2)
        );
    }
    document.getElementById("size_after").innerHTML = "Размер файла после: " + stringForFile.length + " B";
    DownloadFile("3.txt", stringForFile);
}

function DownloadFile(nameFile, content) {
    let blob = new Blob([content], {type: 'text/plain'});
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nameFile;
    link.click();
    URL.revokeObjectURL(link.href);
}