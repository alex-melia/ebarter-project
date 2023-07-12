const { Publisher } = require('../base-publisher');
const { Subjects } = require('../../events/subjects');
const { TradeCreatedEvent } = require('../../events/trade-created-event');

class TradeCreatedPublisher extends Publisher {
	subject = Subjects.TradeCreated;
	constructor(client) {
		super(client);
	}
}

module.exports = { TradeCreatedPublisher };
