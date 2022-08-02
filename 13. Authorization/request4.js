const axios = require('axios')

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla3drZWt3QGtla2ljaC5jb20iLCJwYXNzd29yZCI6Imx1bHdsdWx3IiwiaWF0IjoxNjU5MDA4Njk1LCJleHAiOjE2NTkwMTA1MjV9.RnciPJGGQpLD2-pgNwXpwsR3ybEU0EAyJyLZJX42aRs'

axios({method:'get', url: '/me10', baseURL: 'http://localhost:3000', headers: {"access_token": token}})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });