const { Subjects } = require('./subjects.js');

const TradeCreatedEvent = {
	subject: Subjects.TradeCreated,
	data: {
		initiatorItemId: String,
		receiverItemId: String,
	},
};

module.exports = TradeCreatedEvent;
