process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
const mysql = require('mysql2');
const get_info = require('./using_endpoint').get_info;
const get_current_price = require('./using_endpoint').get_current_price;
const token = '5443913471:AAFPvYdrMFn5VZcmI9bFi4VlWQmgVINrDHA';
const bot = new TelegramBot(token, { polling: true });
const HYPE = ["BTC", "ETH", "XRP", "XLM", "ADA", "DOGE", "DOT", "NEO", "CEL",
    "XNO", "USDT", "DASH", "TRX", "ZEC", "XEM", "BNB", "BSV", "EOS", "VET", "DAI"];
bot.onText(/\/start/, function (msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the only crypto bot you will ever need.\n' +
        'It allows you to check price of nearly 3000 coins and its dynamic through the last 24 hours.\n' +
        'Check the /help command, to see availbale features');
});
bot.onText(/\/help/, function (msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Available commands:\n\n\n' +
        '/listRecent - gives you the current price of 20 most popular coins. Are you curious to know which? Give it a try!\n\n' +
        '/{currency symbol} - gives you the price of the coin for the last 24 hours.\n\n' +
        '/addToFavourite {currency symbol} - adds the coin to your list of favourites. Create your own list of the coins, you are interested in!\n\n' +
        '/deleteFavourite {currency symbol} - removes item from the list\n\n' +
        '/listFavourite - returns the actual price of your favourites');
});
bot.onText(/\/listRecent/, async function (msg, match) {
    const chatId = msg.chat.id;
    let prices = [];
    HYPE.forEach(el => {
        let price = get_current_price(el);
        prices.push(price);
    });
    await Promise.all(prices);
    console.log(prices);
    let needed_info = await HYPE.map(el => `/${el} ${get_current_price(el)}`);
    console.log(needed_info);
});
bot.onText(/\/(.+)/, async function (msg, match) {
    const chatId = msg.chat.id;
    if (match[1] === match[1].toUpperCase()) {
        bot.sendMessage(chatId, 'checking...');
        let result = await get_info(match[1]);
        // .sort((a, b)=>a.minsAgo-b.minsAgo)
        let outputArray = result.price_history.filter(el => el).map(el => `${el.minsAgo / 60} hours ago -> $${el.price}`);
        let output = [match[1], ...outputArray].join('\n');
        bot.sendMessage(chatId, output);
    }
});
//# sourceMappingURL=bot.js.map