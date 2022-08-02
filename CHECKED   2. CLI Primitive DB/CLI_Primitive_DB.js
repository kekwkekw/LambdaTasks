//node CLI_Primitive_DB.js
const inquirer = require('inquirer');
const fs = require("fs");

function get_info() {
    inquirer
        .prompt([
            {
                name: "user_name",
                type: "input",
                message: "What is user's name?",
            }
        ]).then(answer => {
        user_name = answer.user_name;
        if (answer.user_name !== '') {
            inquirer.prompt([
                {
                    name: "user_gender",
                    type: "list",
                    message: "Choose user's gender:",
                    choices: ["Male", "Female"],
                },
                {
                    name: "user_age",
                    type: "number",
                    message: "What is user's age?",
                }
            ]).then(answer => {
                answer.user_name = user_name;
                user_info = answer;
                console.log(user_info);
                return user_info;
            }).then(user_info => {
                fs.readFile('db.txt', 'utf8', function (err, data) {
                    let infos = JSON.parse(data)
                    infos.push(user_info)
                    let output = JSON.stringify(infos)
                    fs.writeFile('db.txt', output, err => {
                        if (err) {
                            console.error(err);
                        }
                    })
                })
            }).then(lmao => get_info())
        } else {
            inquirer.prompt([
                {
                    name: "response",
                    type: "confirm",
                    message: "Do you want to search a name in the database?",
                }]).then(answer => {
                if (answer.response===true) {
                    inquirer
                        .prompt([
                            {
                                name: "user_name",
                                type: "input",
                                message: "What is user's name you want to search info for?",
                            }
                        ]).then(answer => {
                        fs.readFile('db.txt', 'utf8', function (err, data) {
                            // Display the file content
                            let infos = JSON.parse(data)
                            let found = 0
                            for (let i = 0; i < infos.length; i++) {
                                if (JSON.stringify(infos[i]).includes(answer.user_name)) {
                                    console.log(infos[i])
                                    found++
                                }
                            }
                            if (found===0){
                                console.log('There is no such uder in db :(')
                            }
                        });
                    })
                }
            })
        }
    })
}

get_info()





