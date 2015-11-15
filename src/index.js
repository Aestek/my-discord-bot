var Bot = require('discord-bot');
var config = require('../config/config.json');

var bot = new Bot(config.discord);

bot.addService('store', bot.services['mongo-store']('mongodb://localhost/discord'));

var testingChan = '112960513339633664';
var generalChan = '112588514289258496';

// bot
// 	.on(bot.triggers.command, 'hello')
// 	.restrict({ channelId: testingChan })
// 	.do(function(bot, conf, args) {
// 		this.reply('word');
// 	});

// bot
// 	.on(bot.triggers.command, 'setlol')
// 	.describe({
// 		usage: '!setlol [username]',
// 		description: 'Set your League of Legends username.'
// 	})
// 	.restrict({ channelId: testingChan })
// 	.withStore()
// 	.do(function(bot, conf, args) {
// 		if (!args.commandArgs[0])
// 			return this.reply('You did not provide a name :(.');

// 		this.store.data.lol = this.store.data.lol || {};
// 		this.store.data.lol.ign = args.commandArgs[0];

// 		this.store.done();

// 		this.reply('You League of Legends username has been set.');
// 	});

// bot
// 	.on(bot.triggers.command, 'setlol-adm')
// 	.describe({
// 		usage: '!setlol-adm [@discorduser] [username]',
// 		description: 'Set your League of Legends username.'
// 	})
// 	.restrict({ channelId: testingChan })
// 	.do(function(bot, conf, args) {
// 		var that = this;
// 		var user = args.message.mentions[0];

// 		if (!user)
// 			return this.reply('You did not provide a user');

// 		if (!args.commandArgs[1])
// 			return this.reply('You did not provide a name :(.');

// 		bot.getService('store').getAndUpdate(user, function(data, done) {
// 			data.lol = data.lol || {};
// 			data.lol.ign = args.commandArgs[1];
// 			done();

// 			that.reply(user.username + '\'s League of Legends username has been set.');
// 		});
// 	});

// bot
// 	.on(bot.triggers.cron, '0 12 * * *')
// 	.sink(testingChan)
// 	.do(require('./tasks/bonjour-madame'));

// bot
// 	.on(bot.triggers.cron, '* * * * *')
// 	.sink(testingChan)
// 	.forEachUser()
// 	.do(require('./tasks/lol-division'));

bot.use(require('./packages/youtube'));


bot.connect(function() {
	console.log('connected');
});
