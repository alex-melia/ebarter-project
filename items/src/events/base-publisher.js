const { connect, Stan } = require('node-nats-streaming');
const { Subjects } = require('./subjects');

class Publisher {
	constructor(client) {
		this.client = client;
	}

	async publish(data) {
		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), (err) => {
				if (err) {
					return reject(err);
				}
				console.log('Event published to subject', this.subject);
				resolve();
			});
		});
	}
}

module.exports = { Publisher };
