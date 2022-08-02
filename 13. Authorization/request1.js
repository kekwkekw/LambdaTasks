const axios = require('axios')

axios.post('http://localhost:3000/sign_up', {"email":"kekwkekw2@kekich.com","password":"lulwlulw2"})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });