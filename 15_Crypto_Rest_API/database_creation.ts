const mysql = require('mysql2')

const connection = mysql.createConnection({
    host     : 'us-cdbr-east-06.cleardb.net',
    user     : 'bd5e6b22462a14',
    password : '2a6ef195'
});

const db = mysql.createConnection({
    host     : 'us-cdbr-east-06.cleardb.net',
    user     : 'bd5e6b22462a14',
    password : '2a6ef195',
    database: 'crypto'
});

async function create_database(){
    connection.query('CREATE DATABASE IF NOT EXISTS crypto')
    connection.end()
    db.query('CREATE TABLE IF NOT EXISTS price(name VARCHAR(255), symbol VARCHAR(255), price FLOAT, api_used VARCHAR(255), updated_at TIMESTAMP)')
    db.end()
    console.log("Successfully created!")
}

create_database()