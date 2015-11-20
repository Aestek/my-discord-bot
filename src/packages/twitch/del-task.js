module.exports = function() {
	if (!this.store.data.twitch)
		return;

	this.store.data.twitch.channelName = null;
	this.store.done();

	this.reply('Your channel has been deleted from this bot');
};
