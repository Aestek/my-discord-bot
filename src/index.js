var Bot = require('discord-bot');

var bot = new Bot({
	email: process.env.DISCORD_EMAIL,
	password: process.env.DISCORD_PASSWORD,
});

var mongoAddr = process.env.DB_PORT_27017_TCP_ADDR + ':' + process.env.DB_PORT_27017_TCP_PORT;
var mongoUrl = 'mongodb://' + mongoAddr + '/discord';

bot.addService('store', bot.services['mongo-store'](mongoUrl));

bot.addService('logger', new bot.services['logger-aggregate']([
	bot.services['console-logger'],
	new bot.services['channel-logger'](bot, '118319742648975360')
]));

// var testingChan = '112960513339633664';
var generalChan = '112588514289258496';
var admin = '107618748692729856';

bot.use(require('./packages/lol')({
	sink: [generalChan, '107092542922690560'],
	riotKey: process.env.RIOT_KEY,
	admin: admin
}));

bot.use(require('./packages/youtube')({
	sink: '115275054891139078',
	youtubeKey: process.env.YOUTUBE_KEY,
	admin: admin
}));

bot.use(require('./packages/bonjour-madame')({
	sink: generalChan,
	restrict: { serverId: generalChan }
}));

bot.use(require('./packages/twitch')({
	sink: '107637890850258944',
	twitchKey: process.env.TWITCH_KEY,
	admin: admin
}));

bot.use(require('./packages/osu')({
	sink: [generalChan, '110620234418790400'],
	osuKey: process.env.OSU_KEY,
	admin: admin
}));

bot
	.on(bot.triggers.react, /argent/i)
	.restrict({ serverId: generalChan })
	.do(function(bot, conf, args) {
		bot.client.sendMessage(args.message, '**ARGENT** = **POGNON**')
	});

bot.use(bot.packages.help);

bot.connect(function() {
	console.log('connected');
});
