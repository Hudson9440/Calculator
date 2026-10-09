function findNumbers(){
    let space = "-"
    console.log("hjfhgjkhfjh g" + +space)
    let equation = document.getElementById('input').value;
    let currentVal = null;
    let power = -1
    let isDecimal = false
    let isNegative = 1
    let numbers = []
    for (let i = 0; i < equation.length; i++){
        if (Number.isInteger(+equation[i]) && equation[i] != " ") {
            if(isDecimal){
                currentVal += +equation[i] * Math.pow(10, power)
                power--;
            }else{
                currentVal *= 10;
                currentVal += +equation[i];
            }
        }else if (equation[i] == ".") {
            isDecimal = true;
        }else if(equation[i] == "-"){
            isNegative = -1
        }else{
            numbers[numbers.length] = currentVal * isNegative;
            power = -1
            isDecimal = false;
            currentVal = null;
            isNegative = 1;
        }
    }
    numbers.push(currentVal);
    return numbers;
}
function solveEquation(){
    let numbers = findNumbers();
    let equation = document.getElementById('input').value;
    let answer = null;
    document.getElementById('output').textContent = numbers;
    console.log(numbers);
}