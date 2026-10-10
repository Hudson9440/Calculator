document.getElementById('Calculate').addEventListener('click', () => {
    document.getElementById('output').textContent = solveEquation(document.getElementById('input').value);
})

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
        } else if (equation[i] == "-") {
            if (startingindex == null) {
                startingindex = i;
            }
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
    numbers.push([currentVal * isNegative, startingindex, equation.length]);
    return numbers;
}


function solveEquation(equationString) {
    let equation = [...equationString];
    let answer = null;
    let parentheseIndexBackup = []
    let parentheseBackLog = 0
    let parentheseList = [];

    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "(") {
            parentheseIndexBackup.push(i);
            parentheseBackLog++;
        } else if (equation[i] == ")") {
            parentheseIndexBackup.push(i);
            parentheseBackLog--;
        }
        while (parentheseBackLog == 0 && parentheseIndexBackup.length != 0) {
            parentheseList[parentheseList.length] = [parentheseIndexBackup[0], parentheseIndexBackup[parentheseIndexBackup.length - 1]]
            parentheseIndexBackup.pop()
            parentheseIndexBackup.shift()
        }
    }
    for (let i = 0; i < parentheseList.length; i++) {
        if (parentheseList[i][0] - 1 == "/") {
            equation.splice(parentheseList[i][0], parentheseList[i][1] - parentheseList[i][0], solveEquation(equation.slice(parentheseList[i][0] + 1, parentheseList[i][1])));

        } else {
            equation.splice(parentheseList[i][0], parentheseList[i][1] - parentheseList[i][0], "x", solveEquation(equation.slice(parentheseList[i][0] + 1, parentheseList[i][1])));
        }
    }
    let numbers = findNumbers(equation);
    let number1 = null
    let number2 = null
    for (let i = 0; i < equation.length; i++) {
        if (equation[i] == "^") {
            for (let j = 0; j < numbers.length; j++) {
                if (numbers[j][2] == i) {
                    number1 = numbers[j]
                }
            }
            for (let j = 0; j < numbers.length; j++) {
                if (numbers[j][1] == i + 1) {
                    number2 = numbers[j]
                }
            }
            equation.splice(number1[1], number2[2] - number1[1], Math.pow(number1[0], number2[0]));
            answer = Math.pow(number1[0], number2[0]);
        }
    }
    for (let i = 0; i < equation.length; i++) {
        let num1index = null
        let num2index = null
        if (equation[i] == "x") {
            for (let j = 0; j < numbers.length; j++) {
                if (numbers[j][2] == i) {
                    number1 = numbers[j]
                    num1index = j
                    console.log("found Number1 " + number1);
                }
            }
            for (let j = 0; j < numbers.length; j++) {
                if (numbers[j][1] == i + 1) {
                    number2 = numbers[j]
                    num2index = j
                    console.log("found Number2 " + number2);
                }
            }
            equation.splice(number1[1], number2[2] - number1[1], String(number1[0] * number2[0]));
            i--
            answer = number1[0] * number2[0]
            numbers.splice(num1index, 2, [String(number1[0] * number2[0]), number1[1], number1[2]])
            console.log(numbers)
            console.log(equation)
            numbers = findNumbers(equation);
        }
    }

    return answer;
}