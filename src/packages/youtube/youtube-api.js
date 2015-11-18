var request = require('request');

module.exports = {
	getChannelInfos: function(youtubeKey, channelId, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/channels?' +
			'part=snippet' +
			'&id=' + channelId +
			'&key=' + youtubeKey;

		request(url, function(err, res, body) {
			if (err)
				return callback(err);

			var data = JSON.parse(body);

			if (!data.items || !data.items[0])
				return callback('Unable to get infos.');

			callback(null, data.items[0]);
		});
	},
	getVideos: function(youtubeKey, channelId, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/search?' +
			'part=snippet,id' +
			'&channelId=' + channelId +
			'&order=date' +
			'&maxResults=1' +
			'&key=' + youtubeKey;

		request(url, function(err, res, body) {
			if (err)
				return callback(err);

			var data = JSON.parse(body);

			if (!data.items)
				return callback('Unable to get infos.');

			callback(null, data.items);
		});
	}
};
