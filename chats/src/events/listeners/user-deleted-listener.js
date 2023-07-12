const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Chat } = require('../../models/chat');

class UserDeletedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.UserDeleted;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const userId = data.id;
		const chats = await Chat.deleteMany({
			$or: [{ 'initiator.id': userId }, { 'receiver.id': userId }],
		});

		if (!chats) {
			throw new Error('Item not found');
		}

		msg.ack();
	}
}

module.exports = { UserDeletedListener };
