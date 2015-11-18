module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-lol-name', ['userName', 'server'])
			.describe('Set your League of Legends username. Server can be one of [BR, EUNE, EUW, LAN, LAS, NA, OCE, RU, TR, SEA, KR]')
			.withStore()
			.do(require('./set-lol-name-task'));

		bot
			.on(bot.triggers.cron, '* * * * *')
			.sink(options.sink)
			.forEachUser()
			.do(require('./fetch-lol-division-task')({ riotKey: options.riotKey }));
	};
};
