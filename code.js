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
};




function btnClick() {   
    var text = document.getElementById('lr1_input').value;
    var alphabet; // регулярное выражение
    var N = 0; // мощность алфавита
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
        var alphabet_from_string = document.getElementById('lr1_input__alphabet').value;
        N = alphabet_from_string.length;
        alphabet = new RegExp("[" + alphabet_from_string + "]", "gi");
        console.log(alphabet);
    }
    console.log(Math.ceil(Math.log2(N)));

    var K;
    try {
        K = text.match(alphabet).length; // кол-во символов в сообщении
    } catch {
        K = 0;
    }
    var i  = Math.ceil(Math.log2(N)); // информационный вес одного символа
    var I = K * i; // информационный вес сообщения
    
    
    document.getElementById('lr1_weight').innerHTML="Информационный вес: " + I.toString();
    document.getElementById('lr1_power').innerHTML="Мощность: " + N.toString();
};

// --- LR 2 ---

const WIDTH_IMAGE = 100;
const HEIGHT_IMAGE = 100;
const NUMBER_PIXELS = WIDTH_IMAGE * HEIGHT_IMAGE;
const BLACK = 1;
const WHITE = 0;

var flag = false;
var file_array = [];
var current_file_string;

const inputFile = document.getElementById("files");

inputFile.addEventListener('change', (e) => {  
    var file = e.target.files[0];
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

function ShowIcon() {
    let selectedFile = document.getElementById("files").files[0];
    
    let reader = new FileReader();
    reader.onload = function() {
        var icon_text = reader.result;
        current_file_string = icon_text;
        const canvas = document.getElementById("canvas");
        canvas.width = WIDTH_IMAGE;
        canvas.height = WIDTH_IMAGE;
        const context = canvas.getContext("2d");

        const img = new Image(WIDTH_IMAGE, HEIGHT_IMAGE);
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0,0, img.width, img.height);

        let counter = 0;
        while (counter < imageData.data.length) {
            if (icon_text[Math.floor(counter / 4)].toString() == BLACK.toString()) {
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
            counter += 4;
            
        }
        context.putImageData(imageData, 0, 0);
    }
    reader.readAsText(selectedFile);
    
}

function AddZero(string, count) {
    while (string.length < count) {
        string = "0" + string;
    }
    return string;
}

function Compress() {

    var icon_text = current_file_string;
    let index = 1;
    let number_of_repetitions = 0;
    var array_compress = [];
    while (index <= icon_text.length) {
        if (icon_text[index - 1] == icon_text[index] & number_of_repetitions < 127) {
            number_of_repetitions++;
        } else {
            // старший бит - цвет "1" - черный, "0" - белый
            // далее 7 бит кол-ва повторений
            // Примеры:
            // 1 0000111 - повторения цвета "1" 7 раз
            // 0 0000001 - цвет "0" единичный
            // 0 111111 - повторений цвета "0" 127 раз
            array_compress.push(
                icon_text[index - 1] + AddZero((number_of_repetitions + 1).toString(2), 7)
            );
            number_of_repetitions = 0;
        }
        index++;
    }
    array_compress_digit = [];

    for (let i = 0; i < array_compress.length; i++) {
        array_compress_digit[i] = parseInt(array_compress[i], 2);
    }

    // преобразование массива в байт-массив и потом в файл
    let uint8array = new Uint8Array(array_compress_digit.length);
    for (let i = 0; i < array_compress_digit.length; i++) {
        uint8array[i] = array_compress_digit[i];
        console.log(uint8array[i]);
    }
    document.getElementById("size_after").innerHTML = "Размер файла после: " + uint8array.length + " B";
    // скачивание
    DownloadFile("2.txt", uint8array);
}

function MultiplicationRows(string, count) {
    var out_string = "";
    for (let i = 0; i < count; i++) {
        out_string += string;
    }
    return out_string;
}

function Unclench() {
    let selectedFile = document.getElementById("files").files[0];
    let reader = new FileReader(); 
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function() {
        var buf = reader.result;
        var uint8array = new Uint8Array(buf);
        
        console.log(uint8array);
        var array = [];

        for (var i = 0; i < uint8array.byteLength; i++) {
            array[i] = uint8array[i];
        }

        console.log(array);

        var binary_string = new TextDecoder().decode(uint8array);
        console.log(binary_string);

        var binary_array = [];
        for (let i = 0; i < uint8array.length; i++) {
            binary_array.push(AddZero(uint8array[i].toString(2), 8));
        }

        var string_for_file = "";
        for (let i = 0; i < binary_array.length; i++) {
            string_for_file += MultiplicationRows(
                binary_array[i][0].toString(),
                 parseInt(binary_array[i].slice(1), 2)
                );
            
            // console.log(binary_array[i][0].toString(), parseInt(binary_array[i].slice(1), 2));
            // console.log(string_for_file);
        }
        document.getElementById("size_after").innerHTML = "Размер файла после: " + string_for_file.length + " B";
        DownloadFile("3.txt", string_for_file);
    }
}

function DownloadFile(nameFile, content) {
    var blob = new Blob([content], {type: 'text/plain'});
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nameFile;
    link.click();
    URL.revokeObjectURL(link.href);
}