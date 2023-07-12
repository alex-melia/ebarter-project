const { Subjects } = require('./subjects.js');

const UserUpdatedEvent = {
	subject: Subjects.UserUpdated,
	data: {
		id: String,
		f_name: String,
		l_name: String,
		profilePicture: String,
	},
};

module.exports = UserUpdatedEvent;
