const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Item } = require('../../models/item');

class ItemStatusUpdatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.ItemStatusUpdated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		console.log('Received ItemStatusUpdated event:', data);
		const { itemId, status } = data;

		const item = await Item.findOneAndUpdate(
			{ _id: itemId },
			{ status: status },
			{ new: true }
		);

		if (!item) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { ItemStatusUpdatedListener };
