var api = require('./youtube-api');

module.exports = function(options) {
	return function(bot, conf, args) {
		var that = this;

		if (!args.commandArgs.channelId)
			return this.reply('You did not provide a channelId :(.');

		var user = args.commandArgs.user || args.message.author;

		bot.getService('store').getAndUpdate(user, function(data, done) {
			api.getChannelInfos(options.youtubeKey, args.commandArgs.channelId, function(err, res) {
				if (err)
					return that.reply('There was an error setting your Youtube channel :(.')

				if (!res)
					return that.reply('This Youtube channel does not seem to exist :/.');

				data.youtube = data.youtube || {};
				data.youtube.channelId = args.commandArgs.channelId;

				done();

				if (!args.commandArgs.user)
					that.reply('Youtube channel set : **' + res.snippet.title + '**\n' + res.snippet.thumbnails.high.url);
				else
					that.reply(args.commandArgs.user.username + '\'s Youtube channel set : **' + res.snippet.title + '**\n' + res.snippet.thumbnails.high.url);
			});
		});
	};
};
