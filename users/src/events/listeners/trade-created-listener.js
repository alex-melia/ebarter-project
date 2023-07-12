const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { User } = require('../../models/user');

class TradeCreatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.TradeCreated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const initiatorItemId = data.initiatorItemId;
		const receiverItemId = data.receiverItemId;

		const initiator_favourites = await User.updateMany(
			{ 'favourites.id': initiatorItemId },
			{ $pull: { favourites: { id: initiatorItemId } } }
		);

		const receiver_favourites = await User.updateMany(
			{ 'favourites.id': receiverItemId },
			{ $pull: { favourites: { id: receiverItemId } } }
		);

		if (!initiator_favourites || !receiver_favourites) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { TradeCreatedListener };
