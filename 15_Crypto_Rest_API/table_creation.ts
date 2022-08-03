const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'nuepp3ddzwtnggom.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'ontcdgo1icczlmj0',
    password: 'hyaa0f3mdzlstgwm',
    database: 'ithyr8nzywaqgcih',
    ssl : {
        rejectUnauthorized: false
    }
});

async function create_database(){
    db.query('CREATE TABLE IF NOT EXISTS price(name VARCHAR(255), symbol VARCHAR(255), price FLOAT, api_used VARCHAR(255), updated_at TIMESTAMP)')
    db.end()
    console.log("Successfully created!")
}

create_database()