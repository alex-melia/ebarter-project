const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { UserDeletedEvent } = require('../user-deleted-event');

class UserDeletedPublisher extends Publisher {
	subject = Subjects.UserDeleted;
	constructor(client) {
		super(client);
	}
}

module.exports = { UserDeletedPublisher };
