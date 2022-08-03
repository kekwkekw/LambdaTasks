const mysql = require('mysql2')

const db_config = {
    host: 'nuepp3ddzwtnggom.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'ontcdgo1icczlmj0',
    password: 'hyaa0f3mdzlstgwm',
    database: 'ithyr8nzywaqgcih',
    ssl : {
        rejectUnauthorized: false
    }
}

let db

function handleDisconnect() {
    db = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    db.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    db.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ClearDB closed the connection but its all good now, nvm')
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect()

const get_info = ({
                      symbol: coinSymbols,
                      market: market,
                      startDate: startDate,
                      endDate: endDate
                  }) => new Promise(async (resolve, reject) => {
    let marketQuery;
    let dateQuery;
    let query;
    if (market) {
        marketQuery = `SELECT * FROM price WHERE api_used = '${market}'`;
    } else {
        marketQuery = 'SELECT * FROM price';
    }
    if (startDate && endDate) {
        dateQuery = `SELECT * FROM (${marketQuery}) AS T WHERE (updated_at BETWEEN '${startDate}' AND '${endDate}')`;
    } else {
        //select only freshly updated info
        dateQuery = `SELECT * FROM (${marketQuery}) AS T GROUP BY symbol, updated_at`;
    }
    if (coinSymbols) {
        let inSymbols = coinSymbols.split(' ').map(el => `'${el}'`).join(',')
        if (market) {
            // language=SQL format=false
            query = `SELECT * FROM ${dateQuery} AS T WHERE symbol IN ('${inSymbols}') ORDER BY updated_at DESC LIMIT ${coinSymbols.split(' ').length}`;
        } else {
            let limit = startDate && endDate ? '': `LIMIT ${coinSymbols.split(' ').length}`
            query = `SELECT name, symbol, updated_at, AVG(price) AS price FROM (${dateQuery}) AS T WHERE symbol IN (${inSymbols}) GROUP BY name, symbol, updated_at ORDER BY updated_at DESC ${limit}`;
        }
        db.query(query, function (err, result, fields) {
            if (err)
                throw err;
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
    handleDisconnect: handleDisconnect,
    db_config: db_config
}

