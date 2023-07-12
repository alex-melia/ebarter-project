const { Subjects } = require('./subjects.js');

const UserDeletedEvent = {
	subject: Subjects.UserDeleted,
	data: {
		id: String,
	},
};

module.exports = UserDeletedEvent;
