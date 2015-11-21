var TwitchClient = require("node-twitchtv");

module.exports = function(options) {
	var client = new TwitchClient({
		client_id: options.twitchKey
	});

	return function(bot, conf) {
		var that = this;

		bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
			if (!data.twitch || !data.twitch.channelName)
				return;

			client.streams({ channel: data.twitch.channelName }, function(err, response) {
				if (err)
					return console.log(err);

				if (!response.stream && !data.twitch.streaming)
					return;
				else if (!response.stream && data.twitch.streaming) {
					data.twitch.streaming = false;
					done();
					return;
				} else if (!data.twitch.streaming) {
					data.twitch.streaming = true;
					done();

					var message = that.forEachItem.mention() + ' is now streaming **' + response.stream.channel.game + '** on Twitch ! ' +
						response.stream.channel.url + '\n' +
						response.stream.channel.status;

					that.sink(message);
				}
			});
		});
	};
};
