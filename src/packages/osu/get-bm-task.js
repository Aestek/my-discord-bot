var osuApi = require('./osu-api');

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf, args) {
		this.updatingMessage(args.message, [
			function(cb) { cb('*Fetching beatmap infos...*'); },
			function(cb) {
				var match = args.message.content.match(/https?:\/\/osu\.ppy\.sh\/(\w)\/(\d+)/);

				var type = match[1];
				var id = match[2];

				api.getBeatMapSet(type, id, function(err, infos) {
					if (err)
						return console.log(err);

					api.formatBeatMapInfos(infos, type == 'b' ? id : null, function(err, message) {
						cb(message);
					});
				});
			}
		]);
	};
};
