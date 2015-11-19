module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers.cron, '* * * * *')
			.forEachUser()
			.sink(options.sink)
			.name('fetch-youtube-videos')
			.do(require('./fetch-new-videos-task')({ youtubeKey: options.youtubeKey }));

		bot
			.on(bot.triggers['mention-command'], 'set-youtube-channel', ['channelId'])
			.describe('Set your Youtube channel id.')
			.withStore()
			.name('set-youtube-channel')
			.do(require('./set-youtube-channel-task')({ youtubeKey: options.youtubeKey }));

		bot
			.on(bot.triggers['mention-command'], 'get-youtube-channel')
			.describe('get infos about the Youtube channel you set.')
			.withStore()
			.name('get-youtube-channel')
			.do(require('./get-youtube-channel-task')({ youtubeKey: options.youtubeKey }));
	};
};
