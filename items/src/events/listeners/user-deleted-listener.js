const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Item } = require('../../models/item');

class UserDeletedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.UserDeleted;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const userId = data.id;
		const items = await Item.deleteMany({ 'user.id': userId });

		if (!items) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { UserDeletedListener };
