module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers.cron, '* * * * *')
			.forEachUser()
			.sink(options.sink)
			.do(require('./fetch-new-videos-task'));

		bot
			.on(bot.triggers['mention-command'], 'set-youtube-channel', ['channelId'])
			.describe('Set your Youtube channel id.')
			.withStore()
			.do(require('./set-youtube-channel-task'));

		bot
			.on(bot.triggers['mention-command'], 'get-youtube-channel')
			.describe('get infos about the Youtube channel you set.')
			.withStore()
			.do(require('./get-youtube-channel-task'));
	};
};