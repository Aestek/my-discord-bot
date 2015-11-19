var LolApi = require('leagueapi');

function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDivision(LolApi, pname, server, callback) {
	pname = pname.toLowerCase();

	LolApi.Summoner.getByName(pname, server, function(err, summoner) {
		if (err)
			return console.error(err);

		LolApi.getLeagueEntryData(summoner[pname].id, server, function(err, data) {
			if (err)
				return;

			var tier = data[summoner[pname].id][0].tier;
			var divisionStr = ucfirst(tier.toLowerCase()) + data[summoner[pname].id][0].entries[0].division;
			callback(divisionStr);
		});
	});
};

module.exports = function(options) {
	return function(bot, conf, args) {
		var that = this;

		LolApi.init(options.riotKey);

		bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
			if (!data.lol || !data.lol.ign)
				return;

			getDivision(LolApi, data.lol.ign, data.lol.server, function(divisionStr) {
				if (divisionStr == data.lol.division)
					return;

				that.userSink(that.forEachItem, that.forEachItem.mention() + ' is now **' + divisionStr + '** on LoL');

				data.lol.division = divisionStr;
				done();
			});
		});
	};
};
