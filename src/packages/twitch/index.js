module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-twitch-channel', ['channelName'])
			.describe('Set your Twitch channel name')
			.withStore()
			.name('set-twitch-name')
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'adm-set-twitch-channel', ['@user', 'channelName'])
			.name('adsm-set-twitch-name')
			.restrict({ userId: options.admin })
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'del-twitch-channel')
			.describe('Delete your Twitch channel name')
			.withStore()
			.name('del-twitch-name')
			.do(require('./del-task'));

		bot
			.on(bot.triggers.cron, '* * * * *')
			.sink(options.sink)
			.forEachUser()
			.name('fetch-twitch-streams')
			.do(require('./fetch-streams-task')({ twicthKey: options.twicthKey }));
	}
}
