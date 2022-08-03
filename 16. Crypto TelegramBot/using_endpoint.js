const axios = require('axios').default;
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
function extract_needed_by_minsAgo(data, minsAgo) {
    for (const el of data) {
        let updated_at = new Date(el.updated_at);
        let currentMinusMinsAgo = new Date();
        currentMinusMinsAgo.setMinutes(new Date().getMinutes() - minsAgo);
        //in case request is made in time, when info is collecting, for example in 15:30:02 and minAgo=0
        currentMinusMinsAgo.setSeconds(new Date().getSeconds() - 30);
        let currentMinusMinsAgoAnd5mins = new Date(currentMinusMinsAgo);
        currentMinusMinsAgoAnd5mins.setMinutes(currentMinusMinsAgoAnd5mins.getMinutes() - 5);
        if (updated_at > currentMinusMinsAgoAnd5mins && updated_at < currentMinusMinsAgo) {
            return { minsAgo: minsAgo, price: el.price };
        }
    }
}
async function get_info(symbol, minsAgoArray = [0, 30, 60, 60 * 3, 60 * 6, 12 * 60, 24 * 60]) {
    let current = new Date();
    let dayAgo = new Date();
    dayAgo.setDate(current.getDate() - 1);
    let currentFormatted = reformat_date(round_date(current));
    let dayAgoFormatted = reformat_date(round_date(dayAgo));
    let last24HourPrices = await axios({
        method: 'get',
        url: '/get',
        baseURL: 'https://crypto-api-lambda.herokuapp.com',
        params: { symbol: symbol, startDate: dayAgoFormatted, endDate: currentFormatted }
    });
    console.log(last24HourPrices.data);
    let price_history = minsAgoArray.map(minsAgo => extract_needed_by_minsAgo(last24HourPrices.data, minsAgo));
    return { symbol: symbol, price_history: price_history };
}
async function get_current_price(symbol) {
    let response = await axios.get(`https://crypto-api-lambda.herokuapp.com/get?symbol=${symbol}`);
    return response.data;
}
async function lulw() {
    let a = await get_current_price('BTC+ETH');
    console.log(a);
}
lulw();
module.exports = {
    get_info: get_info,
    get_current_price: get_current_price
};
//# sourceMappingURL=using_endpoint.js.map