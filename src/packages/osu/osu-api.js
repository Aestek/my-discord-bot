var request = require('request');
var $ = require('cheerio');
var async = require('async');
var _ = require('underscore');

var Api = function(key) {
	this.key = key;
};

Api.prototype.getBeatMap = function(type, id, callback) {
	var url = 'https://osu.ppy.sh/api/get_beatmaps?k=' + this.key + '&' + type + '=' + id;

	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		try {
			var data = JSON.parse(body);

			if (!data || !data[0])
				return callback(new Error('Invalid response : ' + body));

			callback(null, data);
		} catch (e) {
			callback(e);
		}
	});
};

Api.prototype.getBeatMapSet = function(type, id, callback) {
	if (type == 's')
		return this.getBeatMap(type, id, callback);

	var that = this;

	this.getBeatMap(type, id, function(err, data) {
		if (err)
			return callback(err);

		var setId = data[0].beatmapset_id;

		that.getBeatMap('s', setId, callback);
	});
};

Api.prototype.getBeatMaps = function(options, callback) {
	var url = 'https://osu.ppy.sh/api/get_beatmaps?k=' + this.key;

	if (options.since)
		url += '&since=' + options.since;

	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		try {
			var data = JSON.parse(body);

			if (!data)
				return callback(new Error('Invalid response : ' + body));

			callback(null, data);
		} catch (e) {
			callback(e);
		}
	});
};

Api.prototype.getUser = function(name, callback) {
	var url = 'https://osu.ppy.sh/api/get_user?k=' + this.key + '&u=' + name;
	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		try {
			var data = JSON.parse(body);

			if (!data || !data[0])
				return callback(new Error('Invalid response : ' + body));

			callback(null, data[0]);
		} catch (e) {
			callback(e);
		}
	});
};

Api.prototype.formatBeatMapInfos = function(infos, selected, callback) {
	var that = this;
	var status;

	switch (parseInt(infos[0].approved)) {
		case 3:  status = 'qualified'; break;
		case 2:  status = 'approved';  break;
		case 1:  status = 'ranked';    break;
		case 0:  status = 'pending';   break;
		default: status = 'unranked';
	}

	var msg = '**' + infos[0].artist + '** - **' +
		infos[0].title + '**, mapped by ' +
		infos[0].creator +
		' (' + status + ')\n';

	infos.sort(function(a, b) {
		return b.difficultyrating - a.difficultyrating;
	});

	var drms = 0;
	infos.forEach(function(b) {
		drms = Math.max(drms, b.version.length);
	});

	var padLeft = function(l,s, c) {return Array(l-s.length+1).join(c||" ") + s};
	var padRight = function(l,s, c) {return s + Array(l-s.length+1).join(c||" ")};

	request('https://osu.ppy.sh/s/' + infos[0].beatmapset_id, function(err, res, body) {
		var thumb = $(body).find('img.bmt').attr('src');

		if (thumb)
			msg += thumb.replace(/^\/\//, 'https://') + '\n';

		msg += 'https://osu.ppy.sh/s/' + infos[0].beatmapset_id + '\n';

		that.getPP(infos, function(err, infosWithPP) {
			if (err) {
				console.log(err);
				infosWithPP = infos;
			}

			infosWithPP.forEach(function(b) {
				var starValue = Math.round(b.difficultyrating * 100) / 100;

				if (selected == b.beatmap_id)
					msg += '**';

				msg += '`[';

				if (selected)
					msg += selected == b.beatmap_id ? '> ' : '  ';

				msg += padRight(drms, b.version);

				if (selected)
					msg += selected == b.beatmap_id ? ' <' : '  ';

				msg += ']`';

				msg +=  '  ` CS ' + padLeft(4, b.diff_size) +
						' ` ` AR ' + padLeft(4, b.diff_approach) +
						' ` ` OD ' + padLeft(4, b.diff_overall) +
						' ` ` HP ' + padLeft(4, b.diff_drain) + ' ` ';

				for (var i in b.pp) {
					msg += '*` PP ' + padLeft(3, i.toString()) + '% ' + padLeft(4, Math.round(b.pp[i]).toString()) + '`* ';
				}

				msg +=  '` Stars ` ' +
							':star:'.repeat(Math.round(b.difficultyrating)) +
							' (' + starValue + ')';

				if (selected == b.beatmap_id)
					msg += '**';

				msg += '\n';
			});

			callback(null, msg);
		});
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
};

Api.prototype.getUserRencentPlays = function(user, callback) {
	var url = 'https://osu.ppy.sh/api/get_user_recent?k=' + this.key + '&u=' + user;
	request(url, function(err, res, body) {
		if (err)
			return callback(err);

		var data = JSON.parse(body);

		if (!data)
			return callback(new Error('Invalid response : ' + body));

		callback(null, data);
	});
};

Api.prototype.getPP = function(bmInfos, callback) {
	var q = bmInfos[0].artist + ' - ' + bmInfos[0].title;

	request({
		url: 'https://ppaddict.tillerino.org/ppaddict/beatmaps',
		method: 'post',
		headers: {
			'Content-Type': 'text/x-gwt-rpc; charset=UTF-8',
			'X-GWT-Permutation': '8EB30960AA9774B36D72833C2F0145F3'
		},
		body: '7|0|9|https://ppaddict.tillerino.org/ppaddict/|B286115FB89A22A62BDBCDDD8711BE58|org.tillerino.ppaddict.client.services.BeatmapTableService|getRange|org.tillerino.ppaddict.shared.BeatmapRangeRequest/2860797212|org.tillerino.ppaddict.shared.MinMax/3007168893|org.tillerino.ppaddict.shared.Searches/2104613160||' + q + '|1|2|3|4|1|5|5|6|0|0|6|0|0|6|0|0|1|6|0|0|100|0|6|0|0|6|0|0|6|0|0|7|0|8|9|0|0|6|0|0|0|'
	}, function(err, res, body) {
		if (err)
			return callback(err);

		try {
			body = body.replace(/^\/\/OK/, '').replace(/\\x/g, '');
			var data = JSON.parse(body);

			var infos = [];
			while (data.length >= 17) {
				var d = data.splice(0, 17);

				infos.push({
					setId: d[5],
					id: d[14],
					mod: d[8],
					pp93: d[9],
					pp100: d[11]
				});
			}

			infos = _.filter(infos, function(i) {
				return i.setId == bmInfos[0].beatmapset_id
					&& i.mod == 0;
			});

			infos = _.indexBy(infos, 'id');

			for (var i in bmInfos) {
				var bmInfo = bmInfos[i];
				var ppInfos = infos[bmInfo.beatmap_id];
				if (!ppInfos)
					continue;

				bmInfo.pp = {
					93: ppInfos.pp93,
					100: ppInfos.pp100
				};
			}

			callback(null, bmInfos);
		} catch (e) {
			callback(e);
		}
	});
};

module.exports = Api;
