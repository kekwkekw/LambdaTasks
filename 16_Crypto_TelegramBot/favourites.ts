const mysql = require('mysql2')


const db_config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bf9f39f24e435a',
    password: '9adf235b',
    database: 'heroku_863589f01e1cda6',
    ssl: {
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
        db.close()
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ClearDB closed the connection but we created new, nvm')
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect()

function save_to_db(id, symbol): Promise<void>{
    let sql = 'INSERT INTO favourites (id, symbol) VALUES ?'
    let values = [id, symbol]
    db.query(sql, [[values]], function (err, result) {
        if (err){console.log(err)}
    });
}

const get_from_db =
    (id)=> new Promise(async (resolve, reject) => {
    let sql = `SELECT symbol FROM favourites WHERE id=${id}`
    db.query(sql, (err, result)=>{
        resolve(result.map(el=>el.symbol))
    });
})

function delete_from_db(id, symbol){
    let sql = `DELETE FROM favourites WHERE id=${id} AND symbol='${symbol}'`
    db.query(sql, (err, result)=>{
        if (err){console.log(err)}
    });
}

// async function lulw(){
//     let a = await get_from_db(333352049)
//     console.log(a)
// }
//
// lulw()

module.exports = {
    save_to_db: save_to_db,
    get_from_db: get_from_db,
    delete_from_db: delete_from_db
}



