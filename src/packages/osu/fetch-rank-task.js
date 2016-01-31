var request = require('request');
var osuApi = require('./osu-api');

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf, args) {
		var that = this;

		bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
			if (!data.osu || !data.osu.ign)
				return;

			api.getUser(data.osu.ign, function(err, userInfos) {
				if (err)
					return console.log(err);

				var rank = userInfos.pp_rank;

				var oldRank = data.osu.rank || 0;
				var deltaRank = Math.abs(rank - oldRank);

				var A = 0.98445611;
				var B = 0.6379317652;

				if (deltaRank < Math.round(A * Math.pow(oldRank, B)))
					return;

				var lastNum = (rank + '').substr(-1);

				var l;
				switch (lastNum) {
					case 1: l = 'st'; break;
					case 2: l = 'nd'; break;
					case 3: l = 'rd'; break;
					default: l = 'th';
				}

				that.userSink(that.forEachItem, that.forEachItem.mention() + ' is now **' + rank + '**' + l + ' on Osu!');

				data.osu.rank = rank;
				done();
			});
		});
	};
};
