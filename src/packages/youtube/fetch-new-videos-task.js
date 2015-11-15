var request = require('request');
var config = require('../../../config/config.json');

function getVideos(channelId, callback) {
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

module.exports = function(bot, conf) {
	var that = this;
	bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
		if (!data.youtube || !data.youtube.channelId)
			return;

		var channelId = data.youtube.channelId;

		getVideos(channelId, function(err, videos) {
			if (err)
				return console.log(err);

			data.youtube.videos = data.youtube.videos || [];

			videos.forEach(function(video) {
				if (data.youtube.videos.indexOf(video.id.videoId) != -1)
					return;

				var url = 'https://www.youtube.com/watch?v=' + video.id.videoId;

				var message = that.forEachItem.mention() + ' has posted a new Youtube video : ' + url + ' !';
				that.sink(message);

				data.youtube.videos.push(video.id.videoId);
			});

			done();
		});
	});
};