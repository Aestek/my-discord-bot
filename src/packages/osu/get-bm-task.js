var osuApi = require('./osu-api');

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf, args) {
		this.updatingMessage(args.message, [
			function(cb) { cb('*Fetching beatmap infos...*'); },
			function(cb) {
				var match = args.message.content.match(/https?:\/\/osu\.ppy\.sh\/(\w)\/(\d+)/);

				api.getBeatMap(match[1], match[2], function(err, infos) {
					api.formatBeatMapInfos(infos, function(err, message) {
						cb(message);
					});
				});
			}
		]);
	};
};
