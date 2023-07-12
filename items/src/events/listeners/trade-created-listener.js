const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Item } = require('../../models/item');

class TradeCreatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.TradeCreated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const initiatorItem = await Item.findById(data.initiatorItemId);
		const receiverItem = await Item.findById(data.receiverItemId);

		if (!initiatorItem || !receiverItem) {
			throw new Error('Item not found');
		}

		initiatorItem.status = 'traded';
		receiverItem.status = 'traded';

		await initiatorItem.save();
		await receiverItem.save();

		msg.ack();
	}
}

module.exports = { TradeCreatedListener };
