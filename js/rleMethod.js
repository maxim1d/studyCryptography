export class TypeRead {
    static Buffer = 'buffer';
    static Text = 'text';
    static JSON = 'json';
}
export class TypeWrite {
    static Text = 'text/plain';
    static JSON = 'text/json';
}
class Colors {
    static White = "0";
    static Black = "1";
}

export class RleMethod {
    width = 100;
    height = 100;

    file = null;

    constructor(file = null) {
        this.file = file;
    }

    setFile(file) {
        this.file = file;
    }
    getFile() {
        return this.file;
    }

    createIcon() {
        let randomColorIcon = "";
        for (let count = 0; count < this.width * this.height; count++) {
            randomColorIcon += Math.round(Math.random()).toString();
        }
        return RleMethod.downloadFile("new_rand_icon.txt", randomColorIcon);
    }

    async showIcon(canvas, stringFromFile = null) {
        if (stringFromFile == null) {
            stringFromFile = await RleMethod.readFile(this.file, TypeRead.Text);
        }

        canvas.width = this.width;
        canvas.height = this.height;
        const context = canvas.getContext("2d");
        const image = new Image(this.width, this.height);
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0,0, image.width, image.height);
        for (let counter = 0; counter < imageData.data.length; counter += 4) {
            let currentColor = stringFromFile[Math.floor(counter / 4)].toString()
            if (currentColor === Colors.Black) {
                imageData.data[counter] = 0;
                imageData.data[counter + 1] = 0;
                imageData.data[counter + 2] = 0;
                imageData.data[counter + 3] = 255;
            } else if (currentColor === Colors.White) {
                imageData.data[counter] = 255;
                imageData.data[counter + 1] = 255;
                imageData.data[counter + 2] = 255;
                imageData.data[counter + 3] = 255;
            } else {
                console.log("Непредвиденный цвет: " + currentColor);
            }
        }
        context.putImageData(imageData, 0, 0);
    }

    async compressIcon() {
        let stringFromFile = await RleMethod.readFile(this.file, TypeRead.Text);
        let numberRepetitions = 0;
        let arrayCompressed = [];

        for (let index = 1; index <= stringFromFile.length; index++) {
            if (stringFromFile[index - 1] === stringFromFile[index] && numberRepetitions < 127) {
                numberRepetitions++;
            } else {
                // старший бит - цвет "1" - черный, "0" - белый
                // далее 7 бит кол-ва повторений
                // Примеры:
                // "1111111" => повторение цвета "1" (Черный) 7 раз => 1(Черный) 0000111 (7 в двоичной с/с) => 10000111
                // "0" => повторение цвета "0" (Белый) 1 раз => 0(Белый) 0000001 (1 в двоичной с/с) => 00000001

                arrayCompressed.push(
                    parseInt(
                        stringFromFile[index - 1] + RleMethod.addZero((numberRepetitions + 1).toString(2), 7),
                        2
                    )
                );
                numberRepetitions = 0;
            }
        }

        // преобразование массива в байт-массив и потом в файл
        let uint8array = new Uint8Array(arrayCompressed.length);
        for (let index = 0; index < arrayCompressed.length; index++) {
            uint8array[index] = arrayCompressed[index];
        }

        return RleMethod.downloadFile("compressed_file.txt", uint8array);
    }

    async decompressIcon(canvas = null) {
        let bufferFromFile = await RleMethod.readFile(this.file, TypeRead.Buffer);
        let uint8array = new Uint8Array(bufferFromFile);

        if (!uint8array) {
            console.error("Не удалось прочитать файл для декомпрессии!")
            return;
        }

        let binaryArray = [];
        for (let i = 0; i < uint8array.length; i++) {
            binaryArray.push(RleMethod.addZero(uint8array[i].toString(2), 8));
        }

        let stringForFile = "";
        for (let index = 0; index < binaryArray.length; index++) {
            stringForFile += RleMethod.multiplicationRows(
                binaryArray[index][0].toString(),
                parseInt(binaryArray[index].slice(1), 2)
            );
        }
        RleMethod.downloadFile("decompressed.txt", stringForFile);
        if (canvas !== null) {
            await this.showIcon(canvas, stringForFile);
        }
        return stringForFile.length;
    }

    static downloadFile(nameFile, content, type=TypeWrite.Text) {
        try {
            let blob = new Blob([content], {type: type});
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = nameFile;
            link.click();
            URL.revokeObjectURL(link.href);
            return blob.size;
        } catch (e) {
            return -1;
        }
    }

    static async readFile(file, type) {
        return new Promise(function(resolve) {
            let stringsFromFile;
            let reader = new FileReader();
            reader.onload = function() {
                stringsFromFile = reader.result;
                resolve(stringsFromFile);
            }
            switch(type) {
                case TypeRead.Buffer:
                    reader.readAsArrayBuffer(file);
                    break;
                case TypeRead.Text:
                    reader.readAsText(file);
                    break;
                default:
                    reader.readAsText(file);
                    break;
            }
        });
    }

    static addZero(string, count) {
        while (string.length < count) {
            string = "0" + string;
        }
        return string;
    }

    static multiplicationRows(string, count) {
        let outString = "";
        for (let index = 0; index < count; index++) {
            outString += string;
        }
        return outString;
    }
}