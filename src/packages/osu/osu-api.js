var request = require('request');
var $ = require('cheerio');
var async = require('async');

var bmStatuses = {
	3: 'qualified',
	2: 'approved',
	1: 'ranked',
	0: 'pending'
};

var Api = function(key) {
	this.key = key;
};

Api.prototype.getBeatMap = function(type, id, callback) {
	var url = 'https://osu.ppy.sh/api/get_beatmaps?k=' + this.key + '&' + type + '=' + id;
	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		var data = JSON.parse(body);

		if (!data || !data[0])
			return callback(new Error('Invalid response : ' + body));

		callback(null, data);
	});
};

Api.prototype.getUser = function(name, callback) {
	var url = 'https://osu.ppy.sh/api/get_user?k=' + this.key + '&u=' + name;
	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		var data = JSON.parse(body);

		if (!data || !data[0])
			return callback(new Error('Invalid response : ' + body));

		callback(data[0]);
	});
};

Api.prototype.formatBeatMapInfos = function(infos, callback) {
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

		msg += 'https://osu.ppy.sh/s/' + infos[0].beatmapset_id + '\n';

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

		callback(null, msg);
	});
};

Api.prototype.searchBeatmaps = function(s, callback) {
	var pages = [1,2,3,4,5];

	var beatmaps = [];

	async.each(pages, function(p, callback) {
		var searchUrl = 'https://osu.ppy.sh/p/beatmaplist?q=' + encodeURIComponent(s) + '&m=-1&r=0&g=0&la=0&ra=&page=' + p;
		request(searchUrl, function(err, res, body) {
			if (err)
				return console.log(err);

			var b = $(body);

			b.find('.beatmap').each(function(i, el) {
				var fartist = $(el).find('.artist').text();
				var fname = $(el).find('.title').text();

				var bmId = $(el).attr('id');

				beatmaps.push({
					id: bmId,
					title: fname,
					artist: fartist
				});
			});

			callback();
		});
	}, function() {
		callback(null, beatmaps);
	});
}

module.exports = Api;