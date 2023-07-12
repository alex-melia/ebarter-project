const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { User } = require('../../models/user');

class ItemCreatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.ItemCreated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const itemId = data.id;
		const userId = data.user.id;

		const user = await User.findByIdAndUpdate(
			userId,
			{ $addToSet: { items: itemId } },
			{ new: true }
		);

		if (!user) {
			throw new Error('User not found');
		}

		msg.ack();
	}
}

module.exports = { ItemCreatedListener };
