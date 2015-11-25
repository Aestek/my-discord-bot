module.exports = function(options) {
	return function(bot) {
		function print(t, i) {
			bot.sendMessage(t, '```\n' + JSON.stringify(i, null, "  ") + '\n```');
		}

		bot
			.on(bot.triggers['mention-command'], 'print-infos')
			.withStore()
			.describe('Print all the data I have about you.')
			.do(function(bot, conf, args) {
				print(args.message, this.store.data);
			});

		bot
			.on(bot.triggers['mention-command'], 'adm-print-infos', ['@user'])
			.restrict({ userId: options.admin })
			.do(function(bot, conf, args) {
				bot.getService('store').get(args.commandArgs.user, function(d) {
					print(args.message, d);
				});
			});
	};
};
