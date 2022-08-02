const axios = require('axios').default;

interface cryptoInfo {
    name: string,
    symbol: string,
    price: number,
    updated_at: string
}

function round_date(date: Date): Date {
    let coeff = 1000 * 60 * 5;
    //round to minutes
    return new Date(Math.floor(date.getTime() / coeff) * coeff)
}

function reformat_date(date: Date): string {
    return date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2)
}


function extract_needed_by_minsAgo(data: cryptoInfo[], minsAgo: number): { minsAgo: number, price: number } | undefined {
    for (const el of data) {
        let updated_at = new Date(el.updated_at)
        let currentMinusMinsAgo = new Date()
        currentMinusMinsAgo.setMinutes(new Date().getMinutes() - minsAgo)
        //in case request is made in time, when info is collecting, for example in 15:30:02 and minAgo=0
        currentMinusMinsAgo.setSeconds(new Date().getSeconds() - 30)
        let currentMinusMinsAgoAnd5mins = new Date(currentMinusMinsAgo)
        currentMinusMinsAgoAnd5mins.setMinutes(currentMinusMinsAgoAnd5mins.getMinutes() - 5)
        console.log(currentMinusMinsAgo, currentMinusMinsAgoAnd5mins)
        if (updated_at > currentMinusMinsAgoAnd5mins && updated_at < currentMinusMinsAgo) {
            console.log(updated_at)
            return {minsAgo: minsAgo, price: el.price};
        }
    }
}


async function get_info(symbol: string, minsAgoArray: number[] = [0, 30, 60, 60 * 3, 60 * 6, 12 * 60, 24 * 60]): Promise<{ symbol: string, price_history: ({ minsAgo: number, price: number } | undefined)[] }> {
    let current = new Date()
    let dayAgo = new Date()
    dayAgo.setDate(current.getDate() - 1)
    let currentFormatted = reformat_date(round_date(current))
    let dayAgoFormatted = reformat_date(round_date(dayAgo))
    let last24HourPrices = await axios({
        method: 'get',
        url: '/get',
        baseURL: 'https://crypto-api-lambda.herokuapp.com',
        params: {symbol: symbol, startDate: dayAgoFormatted, endDate: currentFormatted}
    })
    let price_history = minsAgoArray.map(minsAgo => extract_needed_by_minsAgo(last24HourPrices.data, minsAgo))
    return {symbol: symbol, price_history: price_history}
}

async function lulw() {
    let a = await get_info('ETH')
    console.log(a)
}

lulw()