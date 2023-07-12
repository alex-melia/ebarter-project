const { Subjects } = require('./subjects.js');

const ItemCreatedEvent = {
	subject: Subjects.ItemCreated,
	data: {
		id: String,
		type: String,
		category: String,
		title: String,
		value: Number,
		userId: String,
	},
};

module.exports = ItemCreatedEvent;
