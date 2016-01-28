var request = require('request');

function getStreams(channel, callback) {
	request.get({
		url: "https://api.twitch.tv/kraken/streams/" + channel
	}, function(err, response, body) {
		try {
			callback(null, JSON.parse(body));
		} catch (e) {
			callback(e);
		}
	});
}

module.exports = function(options) {
	return function(bot, conf) {
		var that = this;

		bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
			if (!data.twitch || !data.twitch.channelName)
				return;

			getStreams(data.twitch.channelName, function(err, response) {
				if (err)
					return console.log(err);

				if (!response.stream && !data.twitch.streaming)
					return;
				else if (!response.stream && data.twitch.streaming) {
					data.twitch.streaming = false;
					done();
					return;
				} else if (!data.twitch.streaming) {
					var threshold = 60 * 30 * 1000;
					var now = new Date().getTime();

					if (data.twitch.lastCheck && now - data.twitch.lastCheck < threshold)
						return;

					data.twitch.streaming = true;
					data.twitch.lastCheck = now;

					done();

					var message = that.forEachItem.mention() + ' is now streaming **' + response.stream.channel.game + '** on Twitch ! ' +
						response.stream.channel.url + '\n' +
						response.stream.channel.status;

					console.log(message);
					that.sink(message);
				}
			});
		});
	};
};
