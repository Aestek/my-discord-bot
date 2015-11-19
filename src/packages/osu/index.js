module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers['mention-command'], 'set-osu-name', ['userName'])
			.withStore()
			.describe('Set your Osu! name')
			.do(function(bot, conf, args) {
				if (!args.commandArgs.userName)
					return this.reply('You did not provide a name :(.');

				this.store.data.osu = this.store.data.osu || {};
				this.store.data.osu.ign = args.commandArgs.userName;

				this.store.done();

				this.reply('Your Osu! username has been set.');
			});

		bot
			.on(bot.triggers.cron, '0 0/12 * * *')
			.sink(options.sink)
			.forEachUser()
			.do(require('./fetch-rank-task')({ osuKey: options.osuKey }))
	}
}
