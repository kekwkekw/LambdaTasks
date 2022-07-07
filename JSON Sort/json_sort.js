const axios = require('axios');

let endpoints =
    `https://jsonbase.com/lambdajson_type1/793
https://jsonbase.com/lambdajson_type1/955
https://jsonbase.com/lambdajson_type1/231
https://jsonbase.com/lambdajson_type1/931
https://jsonbase.com/lambdajson_type1/93
https://jsonbase.com/lambdajson_type2/342
https://jsonbase.com/lambdajson_type2/770
https://jsonbase.com/lambdajson_type2/491
https://jsonbase.com/lambdajson_type2/281
https://jsonbase.com/lambdajson_type2/718
https://jsonbase.com/lambdajson_type3/310
https://jsonbase.com/lambdajson_type3/806
https://jsonbase.com/lambdajson_type3/469
https://jsonbase.com/lambdajson_type3/258
https://jsonbase.com/lambdajson_type3/516
https://jsonbase.com/lambdajson_type4/79
https://jsonbase.com/lambdajson_type4/706
https://jsonbase.com/lambdajson_type4/521
https://jsonbase.com/lambdajson_type4/350
https://jsonbase.com/lambdajson_type4/64`

let findIsDone =
    (object) =>
        new Promise(async (resolve, reject) => {
            let x = object.isDone
            if (x===undefined){
                Object.values(object).forEach(async (i)=>{
                    if (typeof i=== 'object'){
                        let nt = await findIsDone(i)
                        if (nt!==undefined){
                            resolve(nt)
                        }
                    }
                })
            }
            else{
                resolve(x)
            }
        })

let getResponse =
    (address) =>
        new Promise(async (resolve, reject) => {
            let response
            let counter = 0
            while (counter < 3) {
                response = await axios.get(address)
                if (response.status === 200) {
                    counter = 10
                } else {
                    counter++
                }
            }
            if (counter === 10) {
                let isdone = await findIsDone(response.data)
                resolve(isdone)
            } else {
                console.log(`GET_ERROR: Can't connect to the ${address.split('//')[1]}`)
                resolve(null)
            }
        })

async function readAll(addresses) {
    let amountTrue = 0
    let amountFalse = 0
    let a = 0
    addresses.forEach(async (i) => {
        let resp = await getResponse(i)
        if (resp){
            amountTrue += 1
        }
        else{
            amountFalse += 1
        }
        a++
        if (a===addresses.length){
            console.log(`True amount = ${amountTrue}\nFalse amount = ${amountFalse}`)
        }
    })
}

readAll(endpoints.split('\n'))
