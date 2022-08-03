"use strict";
const axios = require('axios');
const KEY1 = '8b1e4a04-35b2-43a0-8945-92b2291ba8b1';
function round_date(date) {
    let coeff = 1000 * 60 * 5;
    //round to minutes
    return new Date(Math.floor(date.getTime() / coeff) * coeff);
}
function reformat_date(date) {
    return date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
}
async function extract_needed_1() {
    let response = await axios({
        method: 'get',
        url: '/v1/cryptocurrency/listings/latest',
        baseURL: 'https://pro-api.coinmarketcap.com',
        headers: {
            'X-CMC_PRO_API_KEY': KEY1,
            'Accepts': 'application/json'
        },
        parameters: {
            'start': '1',
            'limit': '5000',
            'convert': 'USD'
        }
    });
    return response.data.data.map((el) => {
        return {
            name: el.name,
            symbol: el.symbol,
            price: el.quote.USD.price,
            api_used: "coinmarketcap",
            updated_at: reformat_date(round_date(new Date()))
        };
    });
}
async function extract_needed_2(symbolNameObj) {
    let all_needed_infos = await Promise.all(symbolNameObj.map(async (el) => {
        try {
            let response = await axios.get(`https://api.coinbase.com/v2/prices/${el.symbol}-USD/spot`);
            return {
                name: el.name,
                symbol: el.symbol,
                price: response.data.data.amount,
                api_used: "coinbase",
                updated_at: reformat_date(round_date(new Date()))
            };
        }
        catch (triggerUncaughtException) {
            //just ignore if coinbase has no info about this cryptocurrency lol
        }
    }));
    //return cleared from undefined
    return all_needed_infos.filter(el => el);
}
async function extract_needed_3() {
    let response = await axios.get(`https://api.coinstats.app/public/v1/coins?skip=0&currency=USD`);
    return response.data.coins.map((el) => {
        return {
            name: el.name,
            symbol: el.symbol,
            price: el.price,
            api_used: "coinstats",
            updated_at: reformat_date(round_date(new Date()))
        };
    });
}
async function symbols_and_names() {
    let response = await axios.get(`https://api.kucoin.com/api/v1/currencies`);
    return response.data.data.map((el) => {
        return { symbol: el.currency, name: el.fullName };
    });
}
async function prices_4() {
    let response = await axios.get(`https://api.kucoin.com/api/v1/prices`);
    return response.data.data;
}
async function extract_needed_4() {
    let symbolsAndNames = await symbols_and_names();
    let prices = await prices_4();
    return symbolsAndNames.map((el) => {
        if (prices[el.symbol]) {
            return {
                name: el.name,
                symbol: el.symbol,
                price: prices[el.symbol],
                api_used: "kucoin",
                updated_at: reformat_date(round_date(new Date()))
            };
        }
    }).filter(el => el);
}
async function extract_needed_5() {
    let response = await axios.get(`https://api.coinpaprika.com/v1/tickers`);
    return response.data.map((el) => {
        return {
            name: el.name,
            symbol: el.symbol,
            price: el.quotes.USD.price,
            api_used: "coinpaprika",
            updated_at: reformat_date(round_date(new Date()))
        };
    });
}
async function extract_all() {
    let symbolsAndNames = await symbols_and_names();
    let coinmarketappInfo = extract_needed_1();
    let coinbaseInfo = extract_needed_2(symbolsAndNames);
    let coinstatsInfo = extract_needed_3();
    let kucoinInfo = extract_needed_4();
    let coinpaprikaInfo = extract_needed_5();
    let values = await Promise.all([coinmarketappInfo, coinbaseInfo, coinstatsInfo, kucoinInfo, coinpaprikaInfo]);
    return values.flat(1);
}
// async function lulw(){
//     let a = await extract_all()
//     console.log(a)
// }
//
// lulw()
module.exports = {
    extract_all: extract_all
};
