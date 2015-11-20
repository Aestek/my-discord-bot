module.exports = function(bot, conf, args) {
	var that = this;

	if (!args.commandArgs.userName)
		return this.reply('You did not provide a name :(.');

	if (!args.commandArgs.server)
		return this.reply('You did not provide a server :(.');

	var servers = ['BR', 'EUNE', 'EUW', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR', 'SEA', 'KR'];

	var server = args.commandArgs.server.toUpperCase();

	if (servers.indexOf(server) == -1)
		return this.reply('Server must be one of ' + servers.join(', '));

	var user = args.commandArgs.user || args.message.author;

	bot.getService('store').getAndUpdate(user, function(data, done) {
		data.lol = data.lol || {};
		data.lol.ign = args.commandArgs.userName;
		data.lol.server = args.commandArgs.server;

		done();

		if (!args.commandArgs.user)
			that.reply('Your League of Legends username has been set : ' + data.lol.ign + '.');
		else
			that.reply(args.commandArgs.user.username + '\'s League of Legends username has been set : ' + data.lol.ign + '.');
	});
};
