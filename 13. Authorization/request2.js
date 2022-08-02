const axios = require('axios')

axios.post('http://localhost:3000/login', null, {params: {
    "email":"kekwkekw@kekich.com","password":"lulwlulw"
    }})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });