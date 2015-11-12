var LolApi = require('leagueapi');
var config = require('../../config/config.json');

LolApi.init(config.riotKey, 'euw');

function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDivision(pname, callback) {
	pname = pname.toLowerCase();

	LolApi.Summoner.getByName(pname, 'euw', function(err, summoner) {
		if (err)
			return console.error(err);

		LolApi.getLeagueEntryData(summoner[pname].id, 'euw', function(err, data) {
			if (err)
				return;

			var tier = data[summoner[pname].id][0].tier;
			var divisionStr = ucfirst(tier.toLowerCase()) + data[summoner[pname].id][0].entries[0].division;
			callback(divisionStr);
		});
	});
};

module.exports = function(bot, conf, args) {
	var that = this;

	bot.getService('store').getAndUpdate(this.forEachItem, function(data, done) {
		if (!data.lol || !data.lol.ign)
			return;

		getDivision(data.lol.ign, function(divisionStr) {
			if (divisionStr != data.lol.division)
				that.sink(that.forEachItem.mention() + ' is now **' + divisionStr + '** on LoL');

			data.lol.division = divisionStr;
			done();
		});
	});
};
