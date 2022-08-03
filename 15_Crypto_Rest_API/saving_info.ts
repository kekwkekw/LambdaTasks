const mysql = require('mysql2')
const cron = require('node-cron');
const axios = require('axios')
const gi = require('./getting_infos_from_apis.js')

const db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bd5e6b22462a14',
    password: '2a6ef195',
    database: 'heroku_9310974291683b6'
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let db

function handleDisconnect() {
    db = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    db.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
        db.close()
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ClearDB closed the connection but we created new, nvm')
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

async function save_to_db(): Promise<void>{
    handleDisconnect()
    let start = new Date().getTime();
    let all_infos = await gi.extract_all()
    let sql = 'INSERT INTO price (name, symbol, price, api_used, updated_at) VALUES ?'
    let values = [all_infos.map(el=>[el.name, el.symbol, el.price, el.api_used, new Date(el.updated_at)])]
    try{
        db.query(sql, values, function (err, result) {
            if (err){}
            let end = new Date().getTime();
            let time = end - start;
            console.log(`Saved! Execution time: ${time/1000}s`);
        });
    }
    catch (ERR_STREAM_WRITE_AFTER_END){
        await sleep(1000)
        save_to_db()
    }
}

function dummy_ping(){
    let dummy_ping = axios({
        method: 'get',
        url: '/get',
        baseURL: 'https://crypto-api-lambda.herokuapp.com',
        // baseURL: 'http://localhost:3000',
        params: {symbol: 'kekWkekW'}
    })
    console.log(`Erzhan vstavai`)
}

cron.schedule('* * * * *', function() {
    dummy_ping()
});

cron.schedule('*/5 * * * *', function() {
    save_to_db()
});

handleDisconnect()