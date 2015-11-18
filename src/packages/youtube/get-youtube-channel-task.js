var api = require('./youtube-api');

module.exports = function(options) {
	return function(bot, conf, args) {
		var that = this;

		if (!that.store.data.youtube || !that.store.data.youtube.channelId)
			return this.reply('I don\'t know your youtube channel :(');

		api.getChannelInfos(options.youtubeKey, that.store.data.youtube.channelId, function(err, res) {
			if (err)
				return that.reply('There was an error get your Youtube channel infos :(.')

			if (!res)
				return that.reply('Your Youtube channel does not seem to exist :/.');

			that.reply('Your Youtube channel : **' + res.snippet.title + '**\n' + res.snippet.thumbnails.high.url);
		});
	};
};
