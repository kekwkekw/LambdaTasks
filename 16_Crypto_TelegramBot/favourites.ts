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

function save_to_db(id, symbol): void {
    let db = mysql.createConnection(db_config);
    let sql = 'INSERT INTO favourites (id, symbol) VALUES ?'
    let values = [id, symbol]
    db.query(sql, [[values]], function (err, result) {
        if (err) {
            console.log(err)
        }
        db.end()
    });
}

const get_from_db =
    (id) => new Promise(async (resolve, reject) => {
        let db = mysql.createConnection(db_config);
        let sql = `SELECT symbol
                   FROM favourites
                   WHERE id = ${id}`
        db.query(sql, (err, result) => {
            db.end()
            resolve(result.map(el => el.symbol))
        });
    })

function delete_from_db(id, symbol): void{
    let db = mysql.createConnection(db_config);
    let sql = `DELETE
               FROM favourites
               WHERE id = ${id}
                 AND symbol = '${symbol}'`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            db.end()
        }
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



