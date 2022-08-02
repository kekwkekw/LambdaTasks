const express = require('express');
const jwt = require('jsonwebtoken')
const MongoClient = require("mongodb").MongoClient;
const db_url = 'mongodb://localhost/sign_up_db';
const mongoClient = new MongoClient(db_url);

const app = express();
app.use(express.json());
const port = 3000;

let search_in_users =
    (login_obj) =>
        new Promise(async (resolve, reject) => {
            mongoClient.connect(function (err, client) {
                const db = client.db("db");
                const collection = db.collection("users");

                if (err) return console.log(err);

                collection.find({}).toArray(async function (err, results) {
                    await results.forEach(info_obj => {
                        if (info_obj.email === login_obj.email && info_obj.password === login_obj.password) {
                            client.close();
                            resolve(true)
                        }
                    })
                    client.close();
                    resolve( false)
                });
            });
        })


let search_in_logins =
    (token) =>
        new Promise(async (resolve, reject) => {
            mongoClient.connect(function (err, client) {
                const db = client.db("db");
                const collection = db.collection("logins");

                if (err) return console.log(err);

                collection.find().toArray(async function (err, results) {
                    await results.forEach(info_obj => {
                        if (info_obj.token === token) {
                            client.close();
                            resolve(info_obj)
                        }
                    })
                    await client.close();
                    resolve(false)
                });
            });
})

function create_token(email, password) {
    let expire = Math.ceil(30 + Math.random() * 30);
    return jwt.sign(
        {email, password},
        'secret',
        {
            expiresIn: expire
        }
    )
}

function save_token(token) {
    mongoClient.connect(function (err, client) {
        const db = client.db("db");
        const collection = db.collection("logins");

        if (err) console.log(err);

        collection.insertOne({"token": token}, function (err, result) {

            if (err) return console.log(err);

            client.close();
        });
    })
}

async function refresh_token(old_token, new_token){
    mongoClient.connect(function (err, client) {
        const db = client.db("db");
        const collection = db.collection("logins");

        if (err) return console.log(err);

        collection.updateOne({"token": old_token}, {$set: {"token": new_token}}, function (err, result) {

            if (err) return console.log(err);

            client.close();
        });
    })
}

app.post('/sign_up', async (req, res) => {
    let login_data = req.body
    let exists = await search_in_users(login_data)
    if (!exists) {
        mongoClient.connect(function (err, client) {
            const db = client.db("db");
            const collection = db.collection("users");

            if (err) return console.log(err);

            collection.insertOne(login_data, function (err, result) {

                if (err) return console.log(err);

                client.close();
                res.send('Successfully registred!');
            });
        })
    } else {
        res.send('User already exists!');
    }
})

app.post('/login', async (req, res) => {
    let found = await search_in_users(req.query)
    let email = req.query.email
    let password = req.query.password
    if (found) {
        let token = await create_token(email, password)
        console.log(token)
        save_token(token)
        res.status(201).send("Successfully logged in!")
    } else {
        res.status(401).json({error: "Incorrect Email or Password"})
    }
})

app.post('/refresh', async (req, res) => {
    let token = req.headers.token
    let exists = await search_in_logins(token)
    if (exists) {
        try{
            let decoded = jwt.verify(token, 'secret')
            let new_token = await create_token(decoded.email, decoded.password)
            await refresh_token(token, new_token)
            res.status(202).send(`Token for the user ${decoded.email} successfully refreshed`)
        }
        catch (TokenExpiredError){
            res.status(401).json({error: "Unauthorised"})
        }
    } else {
        res.status(400).json({error: "There is no such token to refresh"})
    }
})

app.get('/me:num', async (req, res) => {
    let num = req.params.num
    let token = req.headers.access_token
    console.log(token)
    let info = await search_in_logins(token)
    if (info) {
        try{
            let decoded = jwt.verify(token, 'secret')
            res.status(202).json({"request_num": num, "data": decoded})
        }
        catch (TokenExpiredError){
            res.status(401).json({error: "Unauthorised"})
        }
    }
    else{
        res.status(402).json({error: "No such token in db!"})
    }
})

app.get('/', async (req, res) => {
    await mongoClient.connect(function (err, client) {
        const db = client.db("db");
        const collection = db.collection("users");

        if (err) return console.log(err);

        collection.find().toArray(function (err, results) {
            console.log(results);
            client.close();
            res.send(results);
        });
    });
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})