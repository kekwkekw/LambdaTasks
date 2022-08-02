const mysql = require('mysql2')
const cron = require('node-cron');
const gi = require('./getting_infos_from_apis.js')

const db_config = {
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bd5e6b22462a14',
    password: '2a6ef195',
    database: 'heroku_9310974291683b6'
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
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ClearDB closed the connection but its all good now, nvm')
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

async function save_to_db(): Promise<void>{
    let start = new Date().getTime();
    let all_infos = await gi.extract_all()
    let sql = 'INSERT INTO price (name, symbol, price, api_used, updated_at) VALUES ?'
    let values = [all_infos.map(el=>[el.name, el.symbol, el.price, el.api_used, new Date(el.updated_at)])]
    db.query(sql, values, function (err, result) {
        if (err){}
        let end = new Date().getTime();
        let time = end - start;
        console.log(`Saved! Execution time: ${time/1000}s`);
    });
}

cron.schedule('0 */5 * * * *', function() {
    save_to_db()
});

handleDisconnect()