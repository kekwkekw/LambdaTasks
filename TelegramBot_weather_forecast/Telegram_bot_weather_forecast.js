//node Telegram_bot_weather_forecast.js
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const token = '5415498459:AAEf0ehx7xdUmUdBceYtY8V0--pItyh7esY';
const bot = new TelegramBot(token, {polling: true});
let lat = 50.450001;
let lon = 30.523333;
let API_key = '4aa98382976958eaaea8d8d8dde9cc53';
let address = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&lang=ru&units=metric`

async function lmao(mode = 0, chatId) {
    let res = await axios.get(address)
    let output = 'Погода в Киеве:\n\nСегодня:'
    let ready = new Promise((resolve) => {
        res.data.list.forEach(async (i, index, array) => {
            let temp = await i.main.temp
            let feelslike = await i.main.feels_like
            let weather = await i.weather[0].description
            let strdate = await i.dt_txt
            let date = await new Date(strdate)
            let string = `\nВ ${date.getHours()}:00 будет ${temp}°, ощущается как ${feelslike}°, ${weather};`
            if (date.getHours() === 0) {
                string = `\n\n${date.getDate()}.${date.getMonth() + 1}` + string
            }
            if (!(mode === 1 && date.getHours() % 2 === 1)) {
                output += string
            }
            if (index === array.length - 1) resolve();
        })
    })
    ready.then(() => {
        bot.sendMessage(chatId, output, {reply_markup: {keyboard: [[{text: 'Погода в Киеве'}]]}})
    })
}

bot.on('message', async (msg) => {
    const chatId = await msg.chat.id;
    const text = await msg.text;
    if (text === 'Погода в Киеве') {
        bot.sendMessage(chatId, 'Выберите один из вариантов:', {reply_markup: {keyboard: [[{text: 'На каждые 3 часа'}, {text: 'На каждые 6 часов'}]]}})
    } else if (text === 'На каждые 3 часа') {
        lmao(0, chatId)
    } else if (text === 'На каждые 6 часов') {
        lmao(1, chatId)
    } else{
        bot.sendMessage(chatId, 'Хочешь узнать погоду?', {reply_markup: {keyboard: [[{text: 'Погода в Киеве'}]]}})
    }
});
