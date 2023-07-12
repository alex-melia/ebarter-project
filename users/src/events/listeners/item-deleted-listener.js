const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { User } = require('../../models/user');

class ItemDeletedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.ItemDeleted;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const itemId = data.id;

		const favourites = await User.updateMany(
			{ 'favourites.id': itemId },
			{ $pull: { favourites: { id: itemId } } }
		);

		if (!favourites) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { ItemDeletedListener };
