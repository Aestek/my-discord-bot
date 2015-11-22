var request = require('request');
var $ = require('cheerio');

function getBeatMap(osuKey, bid, type, callback) {
	var url = 'https://osu.ppy.sh/api/get_beatmaps?k=' + osuKey + '&' + type + '=' + bid;
	request(url, function(err, res, body) {
		if (err)
			return console.log(err);

		var data = JSON.parse(body);

		if (!data || !data[0])
			return console.log(body);

		callback(data);
	});

}

module.exports = function(options) {
	var bmStatuses = {
		3: 'qualified',
		2: 'approved',
		1: 'ranked',
		0: 'pending'
	};

	return function(bot, conf, args) {
		var match = args.message.content.match(/https?:\/\/osu\.ppy\.sh\/(\w)\/(\d+)/);

		getBeatMap(options.osuKey, match[2], match[1], function(infos) {

			var msg = '**' + infos[0].artist + '** - **' +
				infos[0].title + '**, mapped by ' +
				infos[0].creator +
				' (' + bmStatuses[infos[0].approved] + ')\n';

			infos.sort(function(a, b) {
				return b.difficultyrating - a.difficultyrating;
			});

			var drms = 0;
			infos.forEach(function(b) {
				drms = Math.max(drms, b.version.length);
			});

			request('https://osu.ppy.sh/s/' + infos[0].beatmapset_id, function(err, res, body) {
				var thumb = $(body).find('img.bmt').attr('src');

				if (thumb)
					msg += thumb.replace(/^\/\//, 'https://') + '\n';

				infos.forEach(function(b) {
					var starValue = Math.round(b.difficultyrating * 100) / 100;
					var versionStr = '`[' + b.version + '] ' + (' '.repeat(drms - b.version.length)) + ':`';

					msg += versionStr + '  CS: ' +
						b.diff_size + ' AR: ' +
						b.diff_approach + ' OD: ' +
						b.diff_overall + ' HP: ' +
						b.diff_drain + ' Stars: ' +
						':star:'.repeat(Math.round(b.difficultyrating)) +
						' (' + starValue + ')\n';
				});

				bot.client.sendMessage(args.message, msg);
			});
		});
	};
};