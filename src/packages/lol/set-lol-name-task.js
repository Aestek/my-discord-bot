module.exports = function(bot, conf, args) {
	if (!args.commandArgs.userName)
		return this.reply('You did not provide a name :(.');

	this.store.data.lol = this.store.data.lol || {};
	this.store.data.lol.ign = args.commandArgs.userName;
	this.store.data.lol.server = args.commandArgs.server;

	this.store.done();

	this.reply('Your League of Legends username has been set.');
};
