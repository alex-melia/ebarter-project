const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { ItemDeletedEvent } = require('../../events/item-deleted-event');

class ItemDeletedPublisher extends Publisher {
	subject = Subjects.ItemDeleted;
	constructor(client) {
		super(client);
	}
}

module.exports = { ItemDeletedPublisher };
