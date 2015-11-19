var $ = require('cheerio');
var request = require('request');

function getMadam(callback) {
	var that = this;

	request('http://www.bonjourmadame.fr/', function(err, res, body) {
		if (err)
			return console.log(err);

		var url = $(body).find('.photo.post').first().find('img').first().attr('src');
		callback('Madam of the day : ' + url);
	});
}

module.exports = function(options) {
	return function(bot) {
		bot
			.on(bot.triggers.cron, '0 10 * * *')
			.sink(options.sink)
			.name('fetch-bonjour-madame')
			.do(function(bot, conf) {
				var that = this;

				getMadam(function(msg) {
					that.sink(msg);
				});
			});

		bot
			.on(bot.triggers['mention-command'], 'bonjour-madame')
			.name('bonjour-madame')
			.do(function(bot, conf) {
				var that = this;

				getMadam(function(msg) {
					that.reply(msg);
				});
			});
	}
};
