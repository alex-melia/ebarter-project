const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Trade } = require('../../models/trade');

class UserUpdatedListener extends Listener {
	constructor(client, queueGroupName) {
		super(client);
		this.subject = Subjects.UserUpdated;
		this.queueGroupName = queueGroupName;
	}

	async onMessage(data, msg) {
		const userId = data.id;
		const updatedFieldsInitiator = {
			'initiator.f_name': data.f_name,
			'initiator.l_name': data.l_name,
		};
		const updatedFieldsReceiver = {
			'receiver.f_name': data.f_name,
			'receiver.l_name': data.l_name,
		};

		await Trade.updateMany(
			{ 'initiator.id': userId },
			{ $set: updatedFieldsInitiator }
		);
		await Trade.updateMany(
			{ 'receiver.id': userId },
			{ $set: updatedFieldsReceiver }
		);

		msg.ack();
	}
}

module.exports = { UserUpdatedListener };
