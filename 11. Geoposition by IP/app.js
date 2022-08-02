// ngrok http 3000
const express = require('express');
const findIp = require('./find_ip')

const app = express();
const port = 3000;
app.get('/', async (req, res) => {
    let result = await findIp.findIp(req.headers['x-forwarded-for'])
    console.log('Returned response: ', result,'\n\n')
    res.send(result);
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

