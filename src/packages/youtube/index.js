module.exports = function(bot) {

	var testingChan = '112960513339633664';

	bot
		.on(bot.triggers.now)
		.forEachUser()
		.sink(testingChan)
		.do(require('./fetch-new-videos-task'));

	bot
		.on(bot.triggers.command, 'set-youtube-channel')
		.restrict({ channelId: testingChan })
		.withStore()
		.do(function(bot, conf, args) {
			if (!args.commandArgs[0])
				return this.reply('You did not provide a channelId :(.');

			this.store.data.youtube = this.store.data.youtube || {};
			this.store.data.youtube.channelId = args.commandArgs[0];

			this.store.done();

			this.reply('Youtube channel set');
		});
};