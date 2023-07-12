const { Subjects } = require('./subjects.js');

const ItemDeletedEvent = {
	subject: Subjects.ItemDeleted,
	data: {
		id: String,
		userId: String,
	},
};

module.exports = ItemDeletedEvent;
