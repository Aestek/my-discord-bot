module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-osu-name', ['userName'])
			.name('set-osu-name')
			.describe('Set your Osu! name')
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'adm-set-osu-name', ['@user', 'userName'])
			.name('adm-set-osu-name')
			.restrict({ userId: options.admin })
			.do(require('./set-name-task'));

		bot
			.on(bot.triggers.react, /https?:\/\/osu\.ppy\.sh\/(\w)\/(\d+)/)
			.name('get-osu-bm-infos')
			.do(require('./get-bm-task')({ osuKey: options.osuKey }));

		bot
			.on(bot.triggers.cron, '*/20 * * * *')
			.name('fetch-osu-rank')
			.userSink(options.sink)
			.forEachUser()
			.do(require('./fetch-rank-task')({ osuKey: options.osuKey }))
	}
}
