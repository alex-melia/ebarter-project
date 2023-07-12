const { Subjects } = require('./subjects.js');

const ItemUpdatedEvent = {
	subject: Subjects.ItemUpdated,
	data: {
		id: String,
		type: String,
		category: String,
		title: String,
		value: Number,
		userId: String,
	},
};

module.exports = ItemUpdatedEvent;
