const readline = require("readline")
const rl =
    readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

function compare_lenght(a, b) {
    if (a.length < b.length) {
        return -1;
    }
    if (a.length > b.length) {
        return 1;
    }
    return 0;
}

function uniq(a) {
    return Array.from(new Set(a));
}

function sort_answer(answer, whatToDo){
    if (whatToDo == 'exit') {
        return rl.close();
    }
    let allValues = answer.split(" ")
    if (whatToDo == 1 || whatToDo == 4 || whatToDo == 5) {
        let words = []
        for (let i = 0; i < allValues.length; i++) {
            if (isNaN(allValues[i])) {
                words.push(allValues[i])
            }
        }
        if (whatToDo == 1) {
            words = words.sort()
        } else if (whatToDo == 5) {
            words = uniq(words)
        } else {
            words = words.sort(compare_lenght)
        }
        output = words
    } else if (whatToDo == 2 || whatToDo == 3) {
        let numbers = []
        for (let i = 0; i < allValues.length; i++) {
            if (!isNaN(allValues[i])) {
                numbers.push(allValues[i])
            }
        }
        numbers = numbers.map(Number)
        numbers = numbers.sort()
        if (whatToDo == 3) {
            numbers = numbers.reverse()
        }
        numbers = numbers.map(String)
        output = numbers
    } else if (whatToDo == 6) {
        output = uniq(allValues)
    }
    console.log(output)
}

function menu(){
    console.log("\nWhat would you like to do?\n" +
        "1. Sort string by alphabet\n" +
        "2. Sort string by numbers (ascending)\n" +
        "3. Sort string by numbers (descending)\n" +
        "4. Sort string by the length of its words\n" +
        "5. Remove word duplicates\n" +
        "6. Remove all duplicates\n")
}

let output = ""

function run() {
    rl.question('Please enter the string : ', (answer1) => {
        if (answer1 == 'exit') {
            return rl.close();
        }
        menu()
        rl.question('Please enter the number : ',
            (answer2) => {
                sort_answer(answer1, answer2)
                run()
            });
    })
}

run();
