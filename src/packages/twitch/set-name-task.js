module.exports = function(bot, conf, args) {
	if (!args.commandArgs.channelName)
		return this.reply('You did not provide a name :(.');

	this.store.data.twitch = this.store.data.twitch || {};
	this.store.data.twitch.channelName = args.commandArgs.channelName;

	this.store.done();

	this.reply('Your Twitch channel name has been set.');
};
