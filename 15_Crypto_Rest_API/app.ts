const express = require('express');
const get_info = require('./getting_infos_from_db.js').get_info

const app = express();
app.use(express.json());
const port: number = process.env.PORT || 3000;

app.get('/get', async (req, res) => {
    let params = req.query
    let exists = await get_info(params)
    if (!exists) {
        res.status(400).json({error: "There is no such info sry lmao"})
    } else {
        res.send(exists)}
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})