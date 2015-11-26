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
			.on(bot.triggers['mention-command'], 'del-osu-name')
			.name('del-osu-name')
			.describe('Set your Osu! name')
			.do(require('./del-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'adm-del-osu-name', ['@user'])
			.name('adm-del-osu-name')
			.restrict({ userId: options.admin })
			.do(require('./del-name-task'));

		bot
			.on(bot.triggers['mention-command'], 'last-osu', ['userName'])
			.name('get-last-osu-play')
			.describe('Print infos about your last Osu! play')
			.withStore()
			.do(require('./get-last-play-task')({ osuKey: options.osuKey }));

		bot
			.on(bot.triggers.react, /https?:\/\/osu\.ppy\.sh\/(s|b)\/(\d+)/)
			.name('get-osu-bm-infos')
			.do(require('./get-bm-task')({ osuKey: options.osuKey }));

		bot
			.on(bot.triggers.react, /(https?:\/\/osu\.ppy\.sh\/ss\/\d+|http:\/\/puu\.sh\/)/)
			.name('get-ss-infos')
			.do(require('./ss-infos-task')({ osuKey: options.osuKey }));

		bot
			.on(bot.triggers.cron, '*/20 * * * *')
			.name('fetch-osu-rank')
			.userSink(options.sink)
			.forEachUser()
			.do(require('./fetch-rank-task')({ osuKey: options.osuKey }))

		bot
			.on(bot.triggers.cron, '0 16 * * *')
			.name('fetch-new-ranked-maps')
			.userSink(options.sink)
			.do(require('./fetch-new-ranked-task')({ osuKey: options.osuKey }));
	}
}
