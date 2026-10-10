document.getElementById('Calculate').addEventListener('click', () => {
    document.getElementById('output').textContent = solveEquation(document.getElementById('input').value);
})

function isDigit(c) {
    return c !== undefined && /\d/.test(c);
}

function findNumbers(equation) {
    let currentVal = null;
    let power = -1
    let isDecimal = false
    let isNegative = 1
    let startingindex = null
    let endingindex = null
    let numbers = []
    for (let i = 0; i < equation.length; i++) {
        if (Number.isInteger(+equation[i]) && equation[i] != " ") {
            if (startingindex == null) {
                startingindex = i;
            }
            if (isDecimal) {
                currentVal += +equation[i] * Math.pow(10, power)
                power--;
            } else {
                currentVal *= 10;
                currentVal += +equation[i];
            }
        } else if (equation[i] == ".") {
            isDecimal = true;
        } else if (equation[i] == "-" && startingindex == null) {
            startingindex = i;
            isNegative = -1;
            
        } else {
            if (currentVal != null) {
                endingindex = i;
                numbers.push([currentVal * isNegative, startingindex, endingindex]);
                power = -1
                isDecimal = false;
                isNegative = 1;
                startingindex = null
                endingindex = null
            }
            currentVal = null;
        }
    }
    // FIX: only add a final number if one was actually being read
    if (currentVal != null) {
        numbers.push([currentVal * isNegative, startingindex, equation.length]);
    }
    console.log(numbers);
    return numbers;
}


function solveEquation(equationString) {

    let equation = [...equationString].filter(c => c != " ");

    let parentheseList = [];
    let depth = 0;
    let start = null;
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "(") {
            if (depth == 0) start = i;
            depth++;
        } else if (equation[i] == ")") {
            depth--;
            if (depth < 0) return NaN;
            if (depth == 0) parentheseList.push([start, i]);
        }
    }
    if (depth != 0) return NaN;


    for (let i = parentheseList.length - 1; i >= 0; i--) {
        let [open, close] = parentheseList[i];
        let inner = solveEquation(equation.slice(open + 1, close));
        if (isNaN(inner)) return NaN;

        let result = [...String(inner)];
        let prev = equation[open - 1];
        let next = equation[close + 1];
        if (isDigit(prev) || prev == ")") result.unshift("x");
        if (isDigit(next)) result.push("x");
        equation.splice(open, close - open + 1, ...result);
    }


    let numbers = findNumbers(equation);

    for (let i = equation.length - 1; i >= 0; i--) {
        if (equation[i] == "^") {
            let number1 = numbers.find(n => n[2] == i);
            let number2 = numbers.find(n => n[1] == i + 1);
            if (!number1 || !number2) return NaN;
            equation.splice(number1[1], number2[2] - number1[1], ...String(Math.pow(number1[0], number2[0])));
            numbers = findNumbers(equation);
        }
    }

    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "x" || equation[i] == "*") {
            let number1 = numbers.find(n => n[2] == i);
            let number2 = numbers.find(n => n[1] == i + 1);
            if (!number1 || !number2) return NaN;
            equation.splice(number1[1], number2[2] - number1[1], ...String(number1[0] * number2[0]));
            numbers = findNumbers(equation);
            i = -1;
        }
        if (equation[i] == "/") {
            let number1 = numbers.find(n => n[2] == i);
            let number2 = numbers.find(n => n[1] == i + 1);
            if (!number1 || !number2) return NaN;
            equation.splice(number1[1], number2[2] - number1[1], ...String(number1[0] / number2[0]));
            numbers = findNumbers(equation);
            i = -1;
        }
    }
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "+") {
            let number1 = numbers.find(n => n[2] == i);
            let number2 = numbers.find(n => n[1] == i + 1);
            if (!number1 || !number2) return NaN;
            equation.splice(number1[1], number2[2] - number1[1], ...String(number1[0] + number2[0]));
            numbers = findNumbers(equation);
            i = -1;
        }
        if (equation[i] == "-") {
            let number1 = numbers.find(n => n[2] == i);
            let number2 = numbers.find(n => n[1] == i + 1);
            console.log("nums: " + numbers);
            console.log("num1 :" + number1 +"\nnum2 :" + number2);
            if (!number1 || !number2) return NaN;
            console.log("here2");
            equation.splice(number1[1], number2[2] - number1[1], ...String(number1[0] - number2[0]));
            numbers = findNumbers(equation);
            i = -1;
        }
    }

    console.log("end equation:" + equation);
    if (equation.length == 0) return NaN;
    return Number(equation.join(""));
}