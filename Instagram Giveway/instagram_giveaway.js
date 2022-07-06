const fs = require('fs')

Object.defineProperty(Array.prototype, 'subtract', {
    configurable: true,
    value: function subtract(array) {
        return this.filter(
            function (element) {
                const count = this.get(element)

                if (count > 0) {
                    this.set(element, count - 1)
                }

                return count === 0
            }, array.reduce(
                (map, element) => {
                    if (map.has(element)) {
                        map.set(element, map.get(element) + 1)
                    } else {
                        map.set(element, 1)
                    }

                    return map
                }, new Map()
            )
        )
    },
    writable: true
})

let readAll =
    () =>
        new Promise(async (resolve, reject) => {
            let all = []
            for (let i = 0; i < 20; i++) {
                fs.readFile(`out${i}.txt`, 'utf8', async function (err, data) {
                    let usernameArray = await data.split("\n")
                    all.push(usernameArray)
                    if (all.length === 20) {
                        resolve(all)
                    }
                })
            }
        })

let count =
    (k) =>
        new Promise(async (resolve, reject) => {
            let startTime = performance.now()
            let somearray = await readAll()
            let sumOfSets = []
            somearray.forEach((i)=>{
                let distinct = Array.from(new Set(i))
                Array.prototype.push.apply(sumOfSets, distinct)
            })
            for (let i = 1; i <= k; i++) {
                let unique = await new Set(sumOfSets)
                let arUnique = await Array.from(unique)
                sumOfSets = await sumOfSets.subtract(arUnique)
                if (i === k) {
                    let endTime = performance.now()
                    if (k===1){
                        console.log(`Есть ${arUnique.length} уникальных юзеров`)
                    }
                    else if(k===20){
                        console.log(`Есть ${arUnique.length} уникальных юзеров, что встречались во всех ${i} 20 файлах`)
                    }
                    else{
                        console.log(`Есть ${arUnique.length} уникальных юзеров, что встречались в ${i} или более файлах`)
                    }
                    console.log(`TIME: ${(endTime - startTime) / 1000} seconds`)
                    resolve(arUnique.length)
                }
            }
        })

count(1)
count(20)
count(10)
