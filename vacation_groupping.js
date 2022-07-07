const fs = require('fs');

let rawData = fs.readFileSync('vacations.json')
let vacationsBeta = JSON.parse(rawData)

async function remakeVacations(data) {
    let outputjson = []
    let uniqueUsers = {}
    let index = 0
    data.forEach((i) => {
        let name = i.user.name;
        let userId = i.user._id;
        let startDate = i.startDate;
        let endDate = i.endDate;
        if (!Object.keys(uniqueUsers).includes(name)) {
            let obj = {
                'userId': userId,
                'name': name,
                'weekendDates': [{"startDate": startDate, 'endDate': endDate}]
            }
            outputjson.push(obj)
            uniqueUsers[name] = index
            index++
        } else {
            outputjson[uniqueUsers[name]].weekendDates.push({"startDate": startDate, 'endDate': endDate})
        }
    })
    console.log(outputjson)
    fs.writeFile('fixed_vacations.json', JSON.stringify(outputjson, null, 2), 'utf8',function(err, result) {
        if(err) console.log('error', err);
    })
}

remakeVacations(vacationsBeta)