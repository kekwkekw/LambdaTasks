//node find_ip.js

const {once} = require('node:events');
const readline = require('readline');
const fs = require('fs');


let findIp =
    (ipString) =>
        new Promise(async (resolve, reject) => {
            let octets = ipString.split('.')
            let ip_int = await parseInt(octets[0])*(256**3)+parseInt(octets[1])*(256**2)+parseInt(octets[2])*256+parseInt(octets[3])
            let startTime = performance.now()
            const readInterface = await readline.createInterface({
                input: fs.createReadStream('IP2LOCATION-LITE-DB1.CSV'),
                crlfDelay: Infinity
            });
            readInterface.on('line', function (line) {
                let cells = line.split(',')
                let [left, right] = [parseInt(cells[0].slice(1, -1)), parseInt(cells[1].slice(1, -1))]
                if (parseInt(ip_int) >= left && parseInt(ip_int) <= right) {
                    readInterface.close()
                    let endTime = performance.now()
                    console.log(`Time = ${((endTime-startTime)/1000).toFixed(2)}s`)
                    resolve({'ip': ipString, 'ip_int': ip_int, 'code': cells[2].slice(1, -1), 'full_name': cells[3].slice(1, -1)})
                }
            });
        })


module.exports = {
    findIp: findIp,
}
