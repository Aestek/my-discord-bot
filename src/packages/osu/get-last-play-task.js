var osuApi = require('./osu-api');

function nwc(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var padRight = function(l,s, c) {return s + Array(l-s.length+1).join(c||" ")};

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf, args) {
		var that = this;

		this.updatingMessage(args.message, [
			function(cb) { cb('*Looking up your last play...*'); },
			function(cb) {
				api.getUserRencentPlays(args.commandArgs.userName, function(err, plays) {
					if (err)
						return console.log(err);

					var last = plays[0];

					if (!last)
						return cb('Cound not find your last play ;(.');

					api.getBeatMapSet('b', last.beatmap_id, function(err, bm) {
						if (err)
							return console.log(err);

						api.formatBeatMapInfos(bm, last.beatmap_id, function(err, message) {
							if (err)
								return console.log(err);

							var totalPoints = (
								parseInt(last.count300) +
								parseInt(last.count100) +
								parseInt(last.count50) +
								parseInt(last.countmiss)
							) * 300;

							var points =
								last.count300 * 300 +
								last.count100 * 100 +
								last.count50 * 50;

							var accuracy = Math.round(points / totalPoints * 100 * 100) / 100;

							var infos = {
								Score: '**' + nwc(last.score) + '**',
								Accuracy: '**' + accuracy + '**% (**' + last.rank + '**)',
								Combo: nwc(last.maxcombo),
								"300's": nwc(last.count300),
								"100's": nwc(last.count100),
								"50's": nwc(last.count50)
							};

							var ms = 0;

							for (var i in infos)
								ms = Math.max(ms, i.length);

							message += '\n\n';
							for (var i in infos)
								message += '`' + padRight(ms, i) + ':`  ' + infos[i] + '\n';

							cb(message);
						});
					});
				});
			}
		]);
	};
};
