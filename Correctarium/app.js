const express = require('express');
const c = require('./correctarium.js');

const app = express();
app.use(express.json());
const port = 3000;

app.post('/', async (req, res) => {
    let data = req.body
    let result = await c.calc(data.count, data.language, data.mimetype)
    console.log(data, "\n=>\n", result)
    res.json(result);
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})