process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const commander = require('commander')
const TelegramBot = require('node-telegram-bot-api');
const program = new commander.Command()

const token = '5440936952:AAG53VOA8e0ZOuK8hepvPOKS7iUA2_v5mGg';
let chatID = 333352049
const bot = new TelegramBot(token, {polling: false});

program
    .name('sender')
    .description('CLI telegram console sender')

//node CLI_telegram_console_sender.js m qqq
program.command('m')
    .description('Send text message')
    .argument('<string>', 'string to send')
    .action((string)=>{
        bot.sendMessage(chatID, string);
    })

program.command('help')
    .description('Show available commands')
    .action(()=>{
        console.log('This program is used to send telegram messages to the bot t.me/CLI_telegram_console_sender_bot')
        console.log('Available commands: \nm *message* - send a message from the bot. \nExample: m Hello World')
        console.log('\np *path* - send a message from the bot. \nExample: p C:\\Users\\АААААААААААААААААААА\\Pictures\\Photo.jpg \n' +
            'Tip: you can also just drag the photo to the console and it will automatically write its path!\n')})

//node CLI_telegram_console_sender.js p C:\Users\АААААААААААААААААААА\Pictures\Photo.jpg
program.command('p')
    .description('Send text message')
    .argument('<photoPath>', 'path of the photo to send')
    .action((photoPath)=>{
        bot.sendPhoto(chatID, photoPath);
    })

program.parse(process.argv);