var osuApi = require('./osu-api');
var fs = require('fs');
var request = require('request');
var tesseract = require('node-tesseract');
var $ = require('cheerio');
var async = require('async');

function n(s) {
	return s
		.replace(/[^\w]/g, '')
		.replace(/0/, 'o')
		.replace(/1/, 'i')
		.replace(/\|</, 'k')
		.replace(/\|/, 'i')
		.replace(/^\s+/, '')
		.replace(/\s+$/, '')
		.toLowerCase();
}

module.exports = function(options) {
	var api = new osuApi(options.osuKey);

	return function(bot, conf, args) {
		var match = args.message.content.match(/(https?:\/\/osu\.ppy\.sh\/ss\/\d+|http:\/\/puu\.sh\/[\w+.\/]+)/);
		var imgUrl = match[0];
		var imgPath = '/tmp/' + Math.random() + '.jpg';

		var r = request(imgUrl);
		r.on('response', function (res) {
			res.pipe(fs.createWriteStream(imgPath));
			res.on('end', function() {
				tesseract.process(imgPath, function(err, text) {
					if (err)
						return console.log(err);

					text = text.replace(/—/g, '-').replace(/\|</g, 'k').replace(/\|/, 'i');
					var lines = text.split(/\n/).filter(function(l) {
						return !l.match(/^\s*$/);
					});
					var titleLine = lines[0];

					if (!titleLine)
						return;

					var titleParts = titleLine.split(/ - /);

					if (!titleParts || titleParts.length < 2)
						return;

					var artist = titleParts[0].replace(/^\s+/, '').replace(/\s+$/, '');

					var m = titleParts[1].match(/^([^\]]+)\s+\[([^\]]+)\]?.*$/);

					if (!m)
						return;

					var name = m[1];
					var version = m[2];

					var author = '';
					var m = text.match(/Beatmap by (.+)/);

					if (m)
						author = m[1];

					console.log('Matched ss screenshot', [artist, name, version, author]);

					var searchStr = (name + ' ' + author).replace(/[^\w]/g, ' ');

					api.searchBeatmaps(searchStr, function(err, beatmaps) {
						beatmaps = beatmaps.filter(function(b) {
							return n(b.artist) == n(artist) &&
								n(b.title) == n(name);
						});

						async.map(
							beatmaps,
							function(b, callback) {
								api.getBeatMap('s', b.id, callback);
							},
							function(err, beatmaps) {
								if (beatmaps.length > 1) {
									var filteredBeatmaps = beatmaps.filter(function(b) {
										return n(b[0].creator) == n(author);
									});

									if (filteredBeatmaps.length)
										beatmaps = filteredBeatmaps;
								}


								if (!beatmaps.length)
									return;


								beatmaps[0].forEach(function(b) {
									if (n(b.version) != n(version))
										return;

									api.formatBeatMapInfos([b], function(err, message) {
										bot.sendMessage(args.message, message);
									});
								});
							}
						);
					});
				});
			});
		});

	};
};
