module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-twitch-channel', ['channelName'])
			.describe('Set your Twitch channel name')
			.withStore()
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers.cron, '* * * * *')
			.sink(options.sink)
			.forEachUser()
			.do(require('./fetch-streams-task')({ twicthKey: options.twicthKey }));
	}
}
