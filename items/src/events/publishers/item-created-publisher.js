const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { ItemCreatedEvent } = require('../../events/item-created-event');

class ItemCreatedPublisher extends Publisher {
	subject = Subjects.ItemCreated;
	constructor(client) {
		super(client);
	}
}

module.exports = { ItemCreatedPublisher };
