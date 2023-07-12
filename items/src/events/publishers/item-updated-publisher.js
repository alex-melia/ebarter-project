const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { ItemUpdatedEvent } = require('../../events/item-updated-event');

class ItemUpdatedPublisher extends Publisher {
	subject = Subjects.ItemUpdated;
	constructor(client) {
		super(client);
	}
}

module.exports = { ItemUpdatedPublisher };
