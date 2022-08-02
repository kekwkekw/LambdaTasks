"use strict";
const axios = require('axios');
const cron = require('node-cron');
async function dummy_ping() {
    let dummy_ping = await axios({
        method: 'get',
        url: '/get',
        baseURL: 'https://crypto-api-lambda.herokuapp.com',
        params: { symbol: 'kekWkekW' }
    });
    console.log(`Erzhan vstavai`);
}
cron.schedule('0 */20 * * * *', function () {
    dummy_ping();
});
