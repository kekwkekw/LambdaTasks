const axios = require('axios')

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtla3drZWt3QGtla2ljaC5jb20iLCJwYXNzd29yZCI6Imx1bHdsdWx3IiwiaWF0IjoxNjU5MDA4NDI1LCJleHAiOjE2NTkwMTAyNTB9.4TEFtcpVCQ2kJccGIjq9auiA_IFZmxzpSwU_gDFDgtY'
axios.post('http://localhost:3000/refresh', null, {headers: {"token": token}})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });