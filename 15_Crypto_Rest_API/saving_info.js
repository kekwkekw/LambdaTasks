"use strict";
const mysql = require('mysql2');
const cron = require('node-cron');
const axios = require('axios');
const gi = require('./getting_infos_from_apis.js');
const db_config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bf99fa3b5ae5f8',
    password: 'aab2140d',
    database: 'heroku_54686e9601730cd',
    ssl: {
        rejectUnauthorized: false
    }
};
async function save_to_db() {
    let db = mysql.createConnection(db_config);
    let start = new Date().getTime();
    let all_infos = await gi.extract_all();
    let sql = 'INSERT INTO price (name, symbol, price, api_used, updated_at) VALUES ?';
    let values = [all_infos.map(el => [el.name, el.symbol, el.price, el.api_used, new Date(el.updated_at)])];
    db.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
        }
        let end = new Date().getTime();
        let time = end - start;
        console.log(`Saved! Execution time: ${time / 1000}s`);
        db.end();
    });
}
function dummy_ping() {
    let dummy_ping = axios({
        method: 'get',
        url: '/get',
        baseURL: 'https://crypto-api-lambda.herokuapp.com',
        // baseURL: 'http://localhost:3000',
        params: { symbol: 'Erzhan_vstavai' }
    });
}
cron.schedule('* * * * *', function () {
    dummy_ping();
});
cron.schedule('*/5 * * * *', function () {
    save_to_db();
});
