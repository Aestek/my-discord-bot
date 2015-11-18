var api = require('./youtube-api');

module.exports = function(options) {
	return function(bot, conf, args) {
		var that = this;

		if (!args.commandArgs.channelId)
			return this.reply('You did not provide a channelId :(.');

		api.getChannelInfos(options.yotubeKey, args.commandArgs.channelId, function(err, res) {
			if (err)
				return that.reply('There was an error setting your Youtube channel :(.')

			if (!res)
				return that.reply('This Youtube channel does not seem to exist :/.');

			that.store.data.youtube = that.store.data.youtube || {};
			that.store.data.youtube.channelId = args.commandArgs.channelId;

			that.store.done();

			that.reply('Youtube channel set : **' + res.snippet.title + '**\n' + res.snippet.thumbnails.high.url);
		});
	};
};
