const { Publisher, Subjects, ItemCreatedEvent } = require('@ebarter/common2');

class ItemCreatedPublisher extends Publisher {
	constructor(client) {
		super(client);
		this.subject = Subjects.ItemCreated;
	}
}

module.exports = { ItemCreatedPublisher };
