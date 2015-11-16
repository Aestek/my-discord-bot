var request = require('request');
var config = require('../../../config/config.json');

module.exports = {
	getChannelInfos: function(channelId, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/channels?' +
			'part=snippet' +
			'&id=' + channelId +
			'&key=' + config.youtubeKey;

		request(url, function(err, res, body) {
			if (err)
				return callback(err);

			var data = JSON.parse(body);

			callback(null, data.items[0]);
		});
	},
	getVideos: function(channelId, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/search?' +
			'part=snippet,id' +
			'&channelId=' + channelId +
			'&order=date' +
			'&maxResults=1' +
			'&key=' + config.youtubeKey;

		request(url, function(err, res, body) {
			if (err)
				return callback(err);

			var data = JSON.parse(body);

			callback(null, data.items);
		});
	}
};