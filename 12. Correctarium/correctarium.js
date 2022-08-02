function calc_price(x, language, fileExtension) {
    let langMultipliplier = 0.05
    let minPrice = 50
    let extensionMultiplier = 1
    let extensions = ['doc', 'docx', 'rtf', 'none']
    if (language === 'eng') {
        langMultipliplier = 0.12
        minPrice = 120
    }
    if (!extensions.includes(fileExtension)) {
        extensionMultiplier = 1.2
    }
    let price = langMultipliplier * x * extensionMultiplier
    if (price < minPrice) {
        return minPrice
    }
    return Math.ceil(price * 100) / 100
}

function minutes_needed(x, langNum, extensionMultiplier) {
    return Math.ceil((0.5 + x / langNum * extensionMultiplier) * 60)
}

function remake_current(current) {
    if ([0, 6].includes(current.getDay())) {
        let addedDays = current.getDay() === 0 ? 1 : 2
        current.setDate(current.getDate() + addedDays)
        current.setHours(10)
        current.setMinutes(0)
        current.setSeconds(0)
    }
    if (current.getHours() < 10) {
        current.setHours(10)
        current.setMinutes(0)
        current.setSeconds(0)
    } else if (current.getHours() > 19) {
        current.setHours(10)
        current.setMinutes(0)
        current.setSeconds(0)
        //if its friday
        if (current.getDay() === 5) {
            current.setDate(current.getDate() + 3)
        } else {
            current.setDate(current.getDate() + 1)
        }
    }
}

function copy_date(date) {
    return new Date(date.toString())
}

//till end of the wotking day
function calc_timeLeft(current) {
    return 19 * 60 - current.getHours() * 60 - current.getMinutes()
}

function calc_days_needed(timeLeft, minutesNeeded, current) {
    //if it's less time left till 19:00 than task will take
    let daysNeeded = 0
    if (timeLeft < minutesNeeded) {
        daysNeeded = Math.floor((minutesNeeded - timeLeft) / 9 / 60) + 1
        if (current.getDay() + daysNeeded > 5) {
            daysNeeded += Math.floor((current.getDay() + daysNeeded) / 5) * 2
        }
    }
    return daysNeeded
}

function move_deadline(daysNeeded, minutesNeeded, timeLeft, current, deadline) {
    //if it's enough time today
    if (daysNeeded === 0) {
        if (current.getMinutes() + minutesNeeded % 60 > 60) {
            deadline.setHours(current.getHours() + Math.floor(minutesNeeded / 60) + 1)
            deadline.setMinutes(current.getMinutes() - 60 + minutesNeeded % 60)
        } else {
            deadline.setHours(current.getHours() + Math.floor(minutesNeeded / 60))
            deadline.setMinutes(current.getMinutes() + minutesNeeded % 60)
        }
    } else {
        deadline.setDate(current.getDate() + daysNeeded)
        deadline.setHours(10 + Math.floor(((minutesNeeded - timeLeft) % (60 * 9)) / 60))
        deadline.setMinutes((minutesNeeded - timeLeft) % (60 * 9) % 60)
    }
}

function calc_minutesNeeded(x, language, fileExtension) {
    let langNum = language === 'eng' ? 333 : 1333
    let extensionMultiplier = ['doc', 'docx', 'rtf', 'none'].includes(fileExtension) ? 1 : 1.2
    return Math.max(minutes_needed(x, langNum, extensionMultiplier), 60)
}

function calc_deadline(minutesNeeded, pretendedDate) {
    let current = new Date(pretendedDate)
    remake_current(current)
    let deadline = copy_date(current)
    let timeLeft = calc_timeLeft(current)
    let daysNeeded = calc_days_needed(timeLeft, minutesNeeded, current)
    deadline.setDate(current.getDate() + daysNeeded)
    move_deadline(daysNeeded, minutesNeeded, timeLeft, current, deadline)
    return deadline
}

async function calc(x, language, fileExtension) {
    let minutesNeeded = calc_minutesNeeded(x, language, fileExtension)
    let deadline = calc_deadline(minutesNeeded, new Date())
    let price = await calc_price(x, language, fileExtension)
    return {
        'price': price,
        'time': minutesNeeded,
        'deadline': parseInt((deadline.getTime() / 1000).toFixed(0)),
        'deadlineDate': deadline.toLocaleString('en-US', {hour12: false})
    }
}

module.exports = {
    calc_deadline: calc_deadline,
    calc_minutesNeeded: calc_minutesNeeded,
    calc: calc
}