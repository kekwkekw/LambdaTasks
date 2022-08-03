process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const mysql = require('mysql2')
const get_info = require('./using_endpoint').get_info
const token = '5443913471:AAFPvYdrMFn5VZcmI9bFi4VlWQmgVINrDHA';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, function (msg, match) {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Welcome to the only crypto bot you will ever need.\n' +
        'It allows you to check price of nearly 3000 coins and its dynamic through the last 24 hours.\n' +
        'Check the /help command, to see availbale features')
});

bot.onText(/\/help/, function (msg, match) {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Available commands:\n\n\n' +
        '/listRecent - gives you the current price of 20 most popular coins. Are you curious to know which? Give it a try!\n\n' +
        '/{currency symbol} - gives you the price of the coin for the last 24 hours.\n\n' +
        '/addToFavourite {currency symbol} - adds the coin to your list of favourites. Create your own list of the coins, you are interested in!\n\n' +
        '/deleteFavourite {currency symbol} - removes item from the list\n\n' +
        '/listFavourite - returns the actual price of your favourites')
});

bot.onText(/\/(.+)/, async function (msg, match) {
    const chatId = msg.chat.id
    if (match[1] === match[1].toUpperCase()) {
        bot.sendMessage(chatId, 'checking...')
        try {
            let result = await get_info(match[1])
            // .sort((a, b)=>a.minsAgo-b.minsAgo)
            let outputArray = result.price_history.map(el=>`${el.minsAgo/60} hours ago it costed $${el.price}`)
            let output = [match[1], ...outputArray].join('\n')
            bot.sendMessage(chatId, output)
        } catch (UnhandledPromiseRejection) {
            bot.sendMessage(chatId, 'something went wrong, sry. Please try again later')
        }
    }
});

