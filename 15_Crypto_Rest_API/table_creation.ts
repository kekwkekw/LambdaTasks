const mysql = require('mysql2');
const db_config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'bf99fa3b5ae5f8',
    password: 'aab2140d',
    database: 'heroku_54686e9601730cd',
    ssl: {
        rejectUnauthorized: false
    }
};

async function create_database() {
    let db = mysql.createConnection(db_config);
    db.query('CREATE TABLE IF NOT EXISTS price(name VARCHAR(255), symbol VARCHAR(255), price FLOAT, api_used VARCHAR(255), updated_at TIMESTAMP)');
    db.end();
    console.log("Successfully created!");
}

create_database();