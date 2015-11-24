var request = require('request');
var $ = require('cheerio');

module.exports = function(bot) {
	bot
		.on(bot.triggers.command, 'raccoon')
		.do(function() {
			var that = this;
			request(
				'http://thechive.com/2008/12/06/worlds-biggest-collection-of-cute-raccoons-40-photos/',
				function(err, res, body) {
					if (err)
						return;

					var imgs = [];
					$(body).find('section[itemprop="articleBody"] img').each(function(i, el) {
						imgs.push($(el).attr('src'));
					});

					that.reply(imgs[Math.round(Math.random() * (imgs.length - 1))]);
				});
		});
};
