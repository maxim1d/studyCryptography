export class RsaMethod {

    // Расшифровка
    static decrypt(uint32array, privateKey) {
        let encryptedArray = new Uint32Array(uint32array.buffer);
        console.log(uint32array.ArrayBuffer);
        console.log(encryptedArray);
        if (!encryptedArray instanceof Array) {
            return null;
        }
        let resultArray = [];
        for (let encryptedSymbol of encryptedArray) {
            resultArray.push(Number(BigInt(encryptedSymbol)**BigInt(privateKey[0]) % BigInt(privateKey[1])));
        }
        // console.log("Расшифрованный массив -> ", resultArray);
        return this.#getStringFromUnicodeArray(resultArray);
    }

// Шифрование
    static encrypt(string, publicKey) {
        let unicodeArray = this.#getUnicodeArrayFromString(string);
        if (unicodeArray === null) {
            return null;
        }
        if (!unicodeArray instanceof Array) {
            return null;
        }
        // Шифровка
        let arrayEncrypted = [];
        for (let symbol of unicodeArray) {
            arrayEncrypted.push(Number(BigInt(symbol)**BigInt(publicKey[0]) % BigInt(publicKey[1])));
        }
        console.log("Зашифрованный массив -> ", arrayEncrypted);
        // return resultArray;
        console.log(arrayEncrypted);
        let uint32array = new Uint32Array(arrayEncrypted.length);
        for (let index = 0; index < arrayEncrypted.length; index++) {
            uint32array[index] = arrayEncrypted[index];
        }
        return uint32array;
    }

    static #getStringFromUnicodeArray(unicodeArray) {
        if (!unicodeArray instanceof Array) {
            return null;
        }
        let resultString = "";
        for (let unicodeSymbol of unicodeArray) {
            resultString += String.fromCodePoint(Number(unicodeSymbol));
        }
        return resultString;
    }

    static #getUnicodeArrayFromString(message) {
        if (!message instanceof String) {
            return null;
        }
        let result = [];
        for (let symbol of message) {
            result.push(symbol.codePointAt());
        }
        // console.log("Сообщение в юникод -> ", result);
        return result;
    }

    static getPublicAndPrivateKeys(p, q) {
        let n = p * q;
        let f_n = (p - 1) * (q - 1);
        let e = this.#getNOD(f_n);
        let d = this.#getD(e, f_n);
        let publicKey = [e, n];
        let privateKey = [d, n];
        return [publicKey, privateKey];
    }

    static #getD (e, f_n) {
        let d = 1;
        while (true) {
            if ( (e * d) % f_n === 1) {
                return d;
            }
            d++;
        }
    }

    static #getNOD (number) {
        for (let i = 2; i < number; i++) {
            let nod = this.#NOD(i, number);
            if (nod === 1) {
                return i;
            }
        }
        return null;
    }

    static #NOD (firstNumber, secondNumber) {
        firstNumber = Number(firstNumber);
        secondNumber = Number(secondNumber);
        if (secondNumber > firstNumber) return this.#NOD(secondNumber, firstNumber);
        if (!secondNumber) return firstNumber;
        return this.#NOD(secondNumber, firstNumber % secondNumber);
    }

    static #isPrime(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    static generatePrime(min, max) {
        while (true) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (this.#isPrime(num)) return num;
        }
    }
}

// let start = new Date().getTime();
//
// let p = RsaMethod.generatePrime(300,500);
// let q = RsaMethod.generatePrime(600, 700);
// let keys = RsaMethod.getPublicAndPrivateKeys(p, q);
// console.log(keys);
// let publicKey = keys[0];
// let privateKey = keys[1];
// let string = "";
// console.log("Длина строки: ", string.length);
// let encryptArray = RsaMethod.encrypt(string, publicKey);
// let decipherString = RsaMethod.decrypt(encryptArray, privateKey);
// console.log(decipherString);
//
// let end = new Date().getTime();
// let time = end - start;
// console.log('Время выполнения = ' + time/1000);
