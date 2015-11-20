var request = require('request');

function getRank(osuKey, pname, callback) {
	var url = 'https://osu.ppy.sh/api/get_user?k=' + osuKey + '&u=' + pname;
	request(url, function(err, res, body) {
		if (err)
			return console.log(err);

		var data = JSON.parse(body);

		if (!data || !data[0])
			return console.log(body);

		callback(parseInt(data[0].pp_rank));
	});
}

module.exports = function(options) {
	return function(bot, conf, args) {
		var that = this;

		bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
			if (!data.osu || !data.osu.ign)
				return;

			getRank(options.osuKey, data.osu.ign, function(rank) {
				if (Math.abs(rank - (data.osu.rank || 0)) > 1000)
					that.userSink(that.forEachItem, that.forEachItem.mention() + ' is now **' + rank + '\'th** on Osu!');

				if (rank != data.osu.rank) {
					data.osu.rank = rank;
					done();
				}
			});
		});
	};
};
