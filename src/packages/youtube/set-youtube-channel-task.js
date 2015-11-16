var api = require('./youtube-api');

module.exports = function(bot, conf, args) {
	console.log(args.commandArgs);
	return;
	var channelId = args.commandArgs[0];
	var that = this;

	if (!channelId)
		return this.reply('You did not provide a channelId :(.');

	api.getChannelInfos(channelId, function(err, res) {
		if (err)
			return that.reply('There was an error setting your Youtube channel :(.')

		if (!res)
			return that.reply('This Youtube channel does not seem to exist :/.');

		that.store.data.youtube = that.store.data.youtube || {};
		that.store.data.youtube.channelId = args.commandArgs[0];

		that.store.done();

		that.reply('Youtube channel set : **' + res.snippet.title + '**\n' + res.snippet.thumbnails.high.url);
	});
};