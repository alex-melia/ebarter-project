const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { UserUpdatedEvent } = require('../user-updated-event');

class UserUpdatedPublisher extends Publisher {
	subject = Subjects.UserUpdated;
	constructor(client) {
		super(client);
	}
}

module.exports = { UserUpdatedPublisher };
