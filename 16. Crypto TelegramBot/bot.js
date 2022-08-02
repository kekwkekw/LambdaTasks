"use strict";
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const mysql = require('mysql2');
const token = '5443913471:AAFPvYdrMFn5VZcmI9bFi4VlWQmgVINrDHA';
const bot = new TelegramBot(token, { polling: true });
async function get_private(chatId) {
    let res = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    bot.sendMessage(chatId, `Приватбанк:\n $$$\nпокупка ${res.data[0].buy}, продажа ${res.data[0].sale}\n€€€\nпокупка ${res.data[1].buy}, продажа ${res.data[1].sale}`, KEYBOARD);
}
async function get_mono(chatId) {
    try {
        let res = await axios.get('https://api.monobank.ua/bank/currency');
        let dollarAndEuro = res.data.slice(0, 2);
        bot.sendMessage(chatId, `Монобанк:\n $$$\nпокупка ${dollarAndEuro[0].rateBuy}, продажа ${dollarAndEuro[0].rateSell}\n€€€\nпокупка ${dollarAndEuro[1].rateBuy}, продажа ${dollarAndEuro[1].rateSell}`, KEYBOARD);
        fs.writeFile('mono.json', JSON.stringify(dollarAndEuro), err => {
            if (err) {
                console.error(err);
            }
        });
    }
    catch (e) {
        if (e.name === 'AxiosError') {
            fs.readFile('mono.json', 'utf8', function (err, data) {
                let dollarAndEuro = JSON.parse(data);
                bot.sendMessage(chatId, `Монобанк:\n $$$\nпокупка ${dollarAndEuro[0].rateBuy}, продажа ${dollarAndEuro[0].rateSell}\n€€€\nпокупка ${dollarAndEuro[1].rateBuy}, продажа ${dollarAndEuro[1].rateSell}`, KEYBOARD);
            });
        }
        else {
            console.log(e.name);
            throw (e);
        }
    }
}
async function lmao(mode = 0, chatId) {
    let res = await axios.get(address);
    let output = 'Погода в Киеве:\n\nСегодня:';
    let ready = new Promise((resolve) => {
        res.data.list.forEach(async (i, index, array) => {
            let temp = await i.main.temp;
            let feelslike = await i.main.feels_like;
            let weather = await i.weather[0].description;
            let strdate = await i.dt_txt;
            let date = await new Date(strdate);
            let string = `\nВ ${date.getHours()}:00 будет ${temp}°, ощущается как ${feelslike}°, ${weather};`;
            if (date.getHours() === 0) {
                string = `\n\n${date.getDate()}.${date.getMonth() + 1}` + string;
            }
            if (!(mode === 1 && date.getHours() % 2 === 1)) {
                output += string;
            }
            if (index === array.length - 1)
                resolve();
        });
    });
    ready.then(() => {
        bot.sendMessage(chatId, output, KEYBOARD);
    });
}
bot.on('message', async (msg) => {
    const chatId = await msg.chat.id;
    const text = await msg.text;
    if (text === 'Погода в Киеве') {
        bot.sendMessage(chatId, 'Выберите один из вариантов:', { reply_markup: { keyboard: [[{ text: 'На каждые 3 часа' }, { text: 'На каждые 6 часов' }]] } });
    }
    else if (text === 'На каждые 3 часа') {
        lmao(0, chatId);
    }
    else if (text === 'На каждые 6 часов') {
        lmao(1, chatId);
    }
    else if (text === 'Курс валют') {
        get_mono(chatId).then(() => get_private(chatId));
    }
    else {
        bot.sendMessage(chatId, 'Хочешь узнать погоду или курс валют?', KEYBOARD);
    }
});
