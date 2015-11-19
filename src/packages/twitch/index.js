module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-twitch-channel', ['channelName'])
			.describe('Set your Twitch channel name')
			.withStore()
			.name('set-twitch-name')
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers.cron, '* * * * *')
			.sink(options.sink)
			.forEachUser()
			.name('fetch-twitch-streams')
			.do(require('./fetch-streams-task')({ twicthKey: options.twicthKey }));
	}
}
