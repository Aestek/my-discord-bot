var api = require('./youtube-api');

module.exports = function(bot, conf) {
	var that = this;
	bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
		if (!data.youtube || !data.youtube.channelId)
			return;

		var channelId = data.youtube.channelId;

		api.getVideos(channelId, function(err, videos) {
			if (err)
				return console.log(err);

			var lastVideo = videos[0];

			data.youtube.videos = data.youtube.videos || [];

			if (data.youtube.videos.indexOf(lastVideo.id.videoId) != -1)
				return;

			var url = 'https://www.youtube.com/watch?v=' + lastVideo.id.videoId;

			var message = that.forEachItem.mention() + ' has posted a new Youtube video : ' + url + ' !';
			that.sink(message);

			data.youtube.videos.push(lastVideo.id.videoId);

			done(data);
		});
	});
};