const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');

it('returns a 404 if the item is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app).get(`/api/trades/${id}`).send().expect(404);
});

it('returns the trade if the trade is found', async () => {
	const initiator = { id: '1', f_name: 'John' };
	const receiver = { id: '2', f_name: 'Jane' };
	const initiatorItem = { id: '1', title: 'test1' };
	const receiverItem = { id: '2', title: 'test2' };

	const response = await request(app)
		.post('/api/trades')
		.set('Cookie', global.signin())
		.send({
			initiator,
			receiver,
			initiatorItem,
			receiverItem,
		})
		.expect(201);

	const tradeResponse = await request(app)
		.get(`/api/trades/${response.body.id}`)
		.send()
		.expect(200);

	expect(tradeResponse.body.initiator.f_name).toEqual('John');
	expect(tradeResponse.body.receiver.f_name).toEqual('Jane');
	expect(tradeResponse.body.initiatorItem.title).toEqual('test1');
	expect(tradeResponse.body.receiverItem.title).toEqual('test2');
}, 20000);
