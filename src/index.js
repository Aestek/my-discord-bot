var Bot = require('discord-bot');

var bot = new Bot({
	email: process.env.DISCORD_EMAIL,
	password: process.env.DISCORD_PASSWORD,
});

var mongoAddr = process.env.DB_PORT_27017_TCP_ADDR + ':' + process.env.DB_PORT_27017_TCP_PORT;
var mongoUrl = 'mongodb://' + mongoAddr + '/discord';

bot.addService('store', bot.services['mongo-store'](mongoUrl));

var testingChan = '112960513339633664';
var generalChan = '112588514289258496';

bot.use(require('./packages/lol')({
	sink: testingChan,
	riotKey: process.env.RIOT_KEY
}));

bot.use(require('./packages/youtube')({
	sink: testingChan,
	youtubeKey: process.env.YOUTUBE_KEY
}));

bot.use(require('./packages/bonjour-madame')({ sink: generalChan }));

bot.use(require('./packages/twitch')({
	sink: testingChan,
	twitchKey: process.env.TWITCH_KEY
}));

bot.use(bot.packages.help);

bot.connect(function() {
	console.log('connected');
});
