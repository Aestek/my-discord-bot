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
			.name('set-youtube-channel')
			.do(require('./set-youtube-channel-task')({ youtubeKey: options.youtubeKey }));

		bot
			.on(bot.triggers['mention-command'], 'adm-set-youtube-channel', ['@user', 'channelId'])
			.name('adm-set-youtube-channel')
			.restrict({ userId: options.admin })
			.do(require('./set-youtube-channel-task')({ youtubeKey: options.youtubeKey }));

		bot
			.on(bot.triggers['mention-command'], 'del-youtube-channel')
			.describe('Delete your Youtube channel.')
			.name('del-youtube-channel')
			.withStore()
			.do(require('./del-youtube-channel-task'));

		bot
			.on(bot.triggers['mention-command'], 'get-youtube-channel')
			.describe('get infos about the Youtube channel you set.')
			.withStore()
			.name('get-youtube-channel')
			.do(require('./get-youtube-channel-task')({ youtubeKey: options.youtubeKey }));
	};
};
