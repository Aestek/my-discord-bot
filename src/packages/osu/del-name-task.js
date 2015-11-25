module.exports = function(bot, conf, args) {
	var that = this;

	var user = args.commandArgs.user || args.message.author;

	bot.getService('store').getAndUpdate(user, function(data, done) {
		data.osu = data.osu || {};
		data.osu.ign = null;

		done();

		if (!args.commandArgs.user)
			that.reply('Your Osu! username have been deleted.');
		else
			that.reply(args.commandArgs.user.username + '\'s Osu! username have been deleted.');
	});
};
