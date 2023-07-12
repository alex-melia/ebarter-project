const { Subjects } = require('./subjects.js');

const ItemStatusUpdatedEvent = {
	subject: Subjects.ItemStatusUpdated,
	data: {
		itemId: String,
		status: String,
	},
};

module.exports = ItemStatusUpdatedEvent;
