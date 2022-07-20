let http = require('http');

let options = {
    host: 'localhost',
    path: '/',
    port: 3000,
    //This is what changes the request to a POST request
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};

callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        console.log(str);
    });
}

let req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write(JSON.stringify({
    "language": "en",
    "mimetype": "other",
    "count": 100000
}));
req.end();