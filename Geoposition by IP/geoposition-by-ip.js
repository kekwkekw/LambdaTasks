//node geoposition-by-ip.js

const { once } = require('node:events');
const readline = require('readline');
const fs = require('fs');
// const express = require('express');


let findIp =
    (ipString) =>
        new Promise(async (resolve, reject) => {
            const readInterface = await readline.createInterface({
                input: fs.createReadStream('IP2LOCATION-LITE-DB1.CSV'),
                crlfDelay: Infinity
            });
            readInterface.on('line', function (line) {
                let cells = line.split(',')
                let [left, right] = [parseInt(cells[0].slice(1, -1)), parseInt(cells[1].slice(1, -1))]
                if (parseInt(ipString) >= left && parseInt(ipString) <= right) {
                    readInterface.close()
                    resolve({'code': cells[2].slice(1, -1), 'full_name': cells[3].slice(1, -1)})
                }
            });
        })

// let findIpRanges =
//     (countrycode) =>
//         new Promise(async (resolve, reject) => {
//             let ranges = []
//             const readInterface = await readline.createInterface({
//                 input: fs.createReadStream('IP2LOCATION-LITE-DB1.CSV'),
//                 crlfDelay: Infinity
//             });
//             readInterface.on('line', function (line) {
//                 let cells = line.split(',')
//                 if (cells[2] === "\"" + countrycode + "\"") {
//                     ranges.push({from: cells[0].slice(1, -1), to: cells[1].slice(1, -1)})
//                 }
//             });
//             await once(readInterface, 'close');
//             resolve(ranges)
//         })

async function lulw(ipString) {
    let result = await findIp(ipString)
    // result['ip_ranges'] = await findIpRanges(result['code'])
    console.log(result)
}

lulw('3758096383')

