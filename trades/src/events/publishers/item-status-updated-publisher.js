const { Publisher } = require('../base-publisher');
const { Subjects } = require('../subjects');
const { ItemStatusUpdatedEvent } = require('../item-status-updated-event');

class ItemStatusUpdatedPublisher extends Publisher {
	subject = Subjects.ItemStatusUpdated;
	constructor(client) {
		super(client);
	}

	async publish(data) {
		console.log('Publishing ItemStatusUpdated event...');
		return super.publish(data);
	}
}

module.exports = { ItemStatusUpdatedPublisher };
