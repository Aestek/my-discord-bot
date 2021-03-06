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
	sink: ['115275054891139078', '106639274580914176'],
	youtubeKey: process.env.YOUTUBE_KEY,
	admin: admin
}));

bot.use(require('./packages/bonjour-madame')({
	sink: '112588997171089408',
	restrict: { serverId: generalChan }
}));

bot.use(require('./packages/twitch')({
	sink: ['107637890850258944', '106639274580914176'],
	twitchKey: process.env.TWITCH_KEY,
	admin: admin
}));

bot.use(require('./packages/osu')({
	sink: [
		'110620234418790400',
		'106639274580914176'
	],
	osuKey: process.env.OSU_KEY,
	admin: admin,
	restrict: {
		channelId: [
			'107832792523513856',
			'104512036657967104',
			'101964068939632640',
			'110620234418790400',
			'101964105186828288',
			'101964176787771392'
		],
		serverId: '106636755901415424'
	}
}));

bot
	.on(bot.triggers.react, /argent/i)
	.restrict({ serverId: generalChan })
	.do(function(bot, conf, args) {
		bot.client.sendMessage(args.message, '**ARGENT** = **POGNON**')
	});

bot.use(require('./packages/raccoon'));

bot.use(require('./packages/user')({
	admin: admin
}));

bot.use(bot.packages.help);

bot.connect(function() {
	console.log('connected');
});
