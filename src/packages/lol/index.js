module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-lol-name', ['userName', 'server'])
			.name('set-lol-name')
			.describe('Set your League of Legends username. Server can be one of [BR, EUNE, EUW, LAN, LAS, NA, OCE, RU, TR, SEA, KR]')
			.do(require('./set-lol-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'adm-set-lol-name', ['@user', 'userName', 'server'])
			.name('adsm-set-lol-name')
			.restrict({ userId: options.admin })
			.do(require('./set-lol-name-task'));

		bot
			.on(bot.triggers.cron, '*/20 * * * *')
			.userSink(options.sink)
			.forEachUser()
			.name('fetch-lol-division')
			.do(require('./fetch-lol-division-task')({ riotKey: options.riotKey }));
	};
};
