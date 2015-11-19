var $ = require('cheerio');
var request = require('request');

module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers.cron, '0 10 * * *')
			.sink(options.sink)
			.name('bonjour-madame')
			.do(function(bot, conf) {
				var that = this;

				request('http://www.bonjourmadame.fr/', function(err, res, body) {
					if (err)
						return console.log(err);

					var url = $(body).find('.photo.post').first().find('img').first().attr('src');
					that.sink('Madam of the day : ' + url);
				});
			});
	}
};
