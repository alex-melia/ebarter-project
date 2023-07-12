const request = require('supertest');
const { app } = require('../../app');
const { Trade } = require('../../models/trade');
const { natsWrapper } = require('../../nats-wrapper');

natsWrapper.client = {
	publish: jest.fn().mockImplementation((subject, data, callback) => {
		callback();
	}),
};

it('has a route handler listening to /api/trades for post requests', async () => {
	const response = await request(app).post('/api/trades').send({});

	expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
	await request(app).post('/api/trades').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
	const response = await request(app)
		.post('/api/trades')
		.set('Cookie', global.signin())
		.send({
			initiator: '123123',
			receiver: '123123',
			initiatorItem: '123123',
			receiverItem: '123213',
		});

	expect(response.status).not.toEqual(401);
});

it('returns an error if there are invalid details', async () => {
	await request(app)
		.post('/api/trades')
		.set('Cookie', global.signin())
		.send({
			initiator: 413213,
			receiver: '123123',
			initiatorItem: '123123',
			receiverItem: '123213',
		})
		.expect(400);
});

it('creates a trade with valid inputs', async () => {
	let trades = await Trade.find({});
	expect(trades.length).toEqual(0);

	const initiator = { id: '1', f_name: 'John' };
	const receiver = { id: '2', f_name: 'Jane' };
	const initiatorItem = { id: '1', title: 'test1' };
	const receiverItem = { id: '2', title: 'test2' };

	await request(app)
		.post('/api/trades')
		.set('Cookie', global.signin())
		.send({
			initiator,
			receiver,
			initiatorItem,
			receiverItem,
		})
		.expect(201);

	trades = await Trade.find({});
	expect(trades.length).toEqual(1);
	expect(trades[0].initiator.f_name).toEqual('John');
	expect(trades[0].receiver.f_name).toEqual('Jane');
	expect(trades[0].initiatorItem.title).toEqual('test1');
	expect(trades[0].receiverItem.title).toEqual('test2');
});
