module.exports = function() {
	if (!this.store.data.youtube)
		return;

	this.store.data.youtube.channelId = null;
	this.store.done();

	this.reply('Your channel has been deleted from this bot');
};
