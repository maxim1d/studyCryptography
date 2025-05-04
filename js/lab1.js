const outputWeight = document.getElementById('output-weight');
const outputPower = document.getElementById('output-power');
const outputGroup = document.getElementById('text-output-group');
const inputText = document.getElementById('input-text-symbols');
const inputAlphabet = document.getElementById('input-text-alphabet');

document.getElementById('calculate-info-weight').addEventListener('click', function(){
    outputGroup.classList.remove('invisible');
    calculate();
});

document.querySelectorAll('input[type="radio"][name="alphabet"]').forEach(button => {
    button.addEventListener('change', function(){
        checkVisibleInputAlphabet();
    });
});

document.getElementById('clear-all-lr1').addEventListener(
    'click',
    () => {
    clearAll();
});

function checkVisibleInputAlphabet() {
    const randLang = document.getElementById('rand-lang');
    if (randLang.checked) {
        inputAlphabet.classList.remove('invisible');
    } else {
        inputAlphabet.classList.add('invisible');
    }
}

function calculate() {
    let text = document.getElementById('input-text-symbols').value.toString();
    let alphabet; // регулярное выражение
    let N; // мощность алфавита
    if (document.getElementById('eng-lang').checked) {
        console.log("Current language: eng");
        N = 27;
        alphabet = /[a-z ]/gi; // "a-z " - латинские символы и пробел, g, i - флаги для учета символов любого регистра и во всей строке
    }
    else if (document.getElementById('rus-lang').checked) {
        console.log("Current language: rus");
        N = 34;
        alphabet = /[а-я ]/gi;
    } else {
        console.log("Current language: rand-lang");
        let alphabet_from_string = document.getElementById('input-text-alphabet').value;
        N = alphabet_from_string.length;
        alphabet = new RegExp("[" + alphabet_from_string + "]", "gi");
        console.log("Current alphabet: \"" + alphabet_from_string + "\"");
    }

    let K;
    try {
        K = text.match(alphabet).length; // кол-во символов в сообщении
    } catch {
        K = 0;
    }
    let i  = Math.ceil(Math.log2(N)); // информационный вес одного символа
    let I = K * i; // информационный вес сообщения
    
    outputWeight.innerHTML="Информационный вес: " + I.toString();
    outputPower.innerHTML="Мощность: " + N.toString();
}

function clearAll() {
    outputWeight.innerHTML="Информационный вес:";
    outputPower.innerHTML="Мощность:";
    outputGroup.classList.add('invisible');
    inputText.value = "";
    inputAlphabet.value = "";
}