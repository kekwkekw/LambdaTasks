const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bf9f39f24e435a',
    password: '9adf235b',
    database: 'heroku_863589f01e1cda6',
    ssl: {
        rejectUnauthorized: false
    }
});

async function create_database(){
    db.query('CREATE TABLE IF NOT EXISTS favourites(id INT, symbol VARCHAR(255))', (err)=>console.log(err))
    db.end()
    console.log("Successfully created!")
}

create_database()