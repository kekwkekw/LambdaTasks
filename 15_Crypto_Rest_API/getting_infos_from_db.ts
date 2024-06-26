const mysql = require('mysql2')

const db_config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bf99fa3b5ae5f8',
    password: 'aab2140d',
    database: 'heroku_54686e9601730cd',
    ssl : {
        rejectUnauthorized: false
    }
}


const get_info = ({
                      symbol: coinSymbols,
                      market: market,
                      startDate: startDate,
                      endDate: endDate
                  }) => new Promise(async (resolve, reject) => {
    let db = mysql.createConnection(db_config);
    let marketQuery;
    let dateQuery;
    let query;
    if (market) {
        marketQuery = `SELECT *
                       FROM price
                       WHERE api_used = '${market}'`;
    } else {
        marketQuery = 'SELECT * FROM price';
    }
    if (startDate && endDate) {
        dateQuery = `SELECT *
                     FROM (${marketQuery}) AS T
                     WHERE (updated_at BETWEEN '${startDate}' AND '${endDate}')`;
    } else {
        //select only freshly updated info
        dateQuery = `SELECT *
                     FROM (${marketQuery}) AS T
                     GROUP BY symbol, updated_at`;
    }
    if (coinSymbols) {
        let inSymbols = coinSymbols.split(' ').map(el => `'${el}'`).join(',')
        if (market) {
            // language=SQL format=false
            query = `SELECT * FROM ${dateQuery} AS T WHERE symbol IN ('${inSymbols}') ORDER BY updated_at DESC LIMIT ${coinSymbols.split(' ').length}`;
        } else {
            let limit = startDate && endDate ? '' : `LIMIT ${coinSymbols.split(' ').length}`
            query = `SELECT name, symbol, updated_at, AVG(price) AS price
                     FROM (${dateQuery}) AS T
                     WHERE symbol IN (${inSymbols})
                     GROUP BY name, symbol, updated_at
                     ORDER BY updated_at DESC ${limit}`;
        }
        db.query(query, function (err, result, fields) {
            if (err)
                throw err;
            db.end()
            resolve(result);
        });
    }
});

// async function lulw() {
//     let result = await get_info({symbol: 'USDT'})
//     console.log(result)
// }
//
// lulw()

module.exports = {
    get_info: get_info,
    // handleDisconnect: handleDisconnect,
    db_config: db_config
}

