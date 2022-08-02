const express = require('express');
const MongoClient = require("mongodb").MongoClient;
const db_url: string = 'mongodb://localhost/json_db';
const mongoClient = new MongoClient(db_url);

const app = express();
app.use(express.json());
const port: number = 3000;

interface data_object{
    route: string,
    data: object
}

function save_data(route: string, data: object): void {
    mongoClient.connect()
    const db = mongoClient.db("json_db");
    const collection = db.collection("data");
    collection.insertOne({'route': route, 'data': data})
}

function update_route(route: string, data: object): void {
    mongoClient.connect()
    const db = mongoClient.db("json_db");
    const collection = db.collection("data");
    collection.updateOne({'route': route}, {$set: {'data': data}})
}

function check_route(route: string): data_object|null {
    mongoClient.connect()
    const db = mongoClient.db("json_db");
    const collection = db.collection("data");
    return collection.findOne({'route': route})
}

app.post('/:route', async (req, res) => {
    let route = req.params.route
    let data = req.body
    let exists = await check_route(route)
    if (!exists){
        await save_data(route, data)
        res.send("Saved!")
    }
    else{
        await update_route(route, data)
        res.send('Updated!')
    }
})

app.get('/:route', async (req, res) => {
    let route = req.params.route
    let exists = await check_route(route)
    if (!exists) {
        res.send('No such route!')
    } else {
        res.send(exists.data)
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})