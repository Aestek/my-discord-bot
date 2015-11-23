var osuApi = require('./osu-api');
var _ = require('underscore');
var dateFormat = require('dateformat');
var async = require('async');

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf) {
		var that = this;

		var now = new Date().getTime();
		var yesterday = now - 60 * 60 * 24 * 1000;

		api.getBeatMaps({ since: dateFormat(yesterday, 'yyyy-mm-dd') }, function(err, bm) {
			bm = bm.filter(function(bs) {
				return bs.approved == 1 && bs.difficultyrating > 5.5;
			});

			if (!bm.length)
				return;

			var bm = _.groupBy(bm, 'beatmapset_id');

			async.map(bm, api.formatBeatMapInfos, function(err, bm) {
				that.sink('New 5.5*+ have been ranked !', function() {
					for (var i in bm)
						that.sink(bm[i]);
				});
			});
		});
	}
}