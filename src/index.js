var Bot = require('discord-bot');
var config = require('../config/config.json');

var bot = new Bot(config.discord);

var mongoAddr = process.env.DB_PORT_27017_TCP_ADDR + ':' + process.env.DB_PORT_27017_TCP_PORT;
var mongoUrl = 'mongodb://' + mongoAddr + '/discord';

bot.addService('store', bot.services['mongo-store'](mongoUrl));

var testingChan = '112960513339633664';
var generalChan = '112588514289258496';

bot.use(require('./packages/lol')({ sink: testingChan }));
bot.use(require('./packages/youtube')({ sink: testingChan }));
bot.use(require('./packages/bonjour-madame')({ sink: testingChan }));
bot.use(require('./packages/twitch')({ sink: testingChan }));
bot.use(bot.packages.help);

bot.connect(function() {
	console.log('connected');
});
