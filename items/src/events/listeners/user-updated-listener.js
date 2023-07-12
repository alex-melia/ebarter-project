const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Item } = require('../../models/item');

class UserUpdatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.UserUpdated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const userId = data.id;
		const updatedFields = {
			'user.f_name': data.f_name,
			'user.l_name': data.l_name,
			'user.profilePicture': data.profilePicture,
		};

		const items = await Item.updateMany(
			{ 'user.id': userId },
			{ $set: updatedFields }
		);

		if (!items) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { UserUpdatedListener };
