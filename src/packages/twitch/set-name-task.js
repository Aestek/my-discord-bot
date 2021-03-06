module.exports = function(bot, conf, args) {
	var that = this;

	if (!args.commandArgs.channelName)
		return this.reply('You did not provide a name :(.');

	var user = args.commandArgs.user || args.message.author;

	bot.getService('store').getAndUpdate(user, function(data, done) {
		data.twitch = data.twitch || {};
		data.twitch.channelName = args.commandArgs.channelName;

		done();

		if (!args.commandArgs.user)
			that.reply('Your Twitch channel name has been set.');
		else
			that.reply(args.commandArgs.user.username + '\'s Twitch channel name has been set.');
	});
};
