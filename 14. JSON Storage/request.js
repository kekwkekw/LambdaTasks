const axios = require('axios')

axios({method:'post', url: '/me2', baseURL: 'http://localhost:3000', data: {"Ba":"aaaaaaaaaa"}})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });