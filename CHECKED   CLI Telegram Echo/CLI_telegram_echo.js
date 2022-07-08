//node CLI_telegram_echo.js
process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = '5494843165:AAEcf23byKW_DuyblVI42cw5v49wYJh2k7s';
const bot = new TelegramBot(token, {polling: true});
const axios = require('axios').default;

bot.on('message', async (msg) => {
    const chatId = await msg.chat.id;
    const text = await msg.text;
    if (text.toLowerCase() === 'photo'){
        const res = await axios.get('https://picsum.photos/1920/1080', {
            responseType: 'stream'})
        bot.sendPhoto(chatId, res.data)
    }
    else{
        bot.sendMessage(chatId, `Вы написали '${text}'`);
    }
});