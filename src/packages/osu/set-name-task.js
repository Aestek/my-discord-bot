module.exports = function(bot, conf, args) {
	var that = this;

	if (!args.commandArgs.userName)
		return this.reply('You did not provide a name :(.');

	var user = args.commandArgs.user || args.message.author;

	bot.getService('store').getAndUpdate(user, function(data, done) {
		data.osu = data.osu || {};
		data.osu.ign = args.commandArgs.userName;

		done();

		if (!args.commandArgs.user)
			that.reply('Your Osu! username has been set : ' + data.osu.ign + '.');
		else
			that.reply(args.commandArgs.user.username + '\'s Osu! username has been set : ' + data.osu.ign + '.');
	});
};
