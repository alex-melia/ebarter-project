const request = require('supertest');
const { app } = require('../../app');
const { Item } = require('../../models/item');
const { natsWrapper } = require('../../nats-wrapper');

natsWrapper.client = {
	publish: jest.fn().mockImplementation((subject, data, callback) => {
		callback();
	}),
};

it('has a route handler listening to /api/items for post requests', async () => {
	const response = await request(app).post('/api/items').send({});

	expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
	await request(app).post('/api/items').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
	const response = await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({});

	expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: '',
			value: 10,
		})
		.expect(400);

	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			value: 10,
		})
		.expect(400);
});

it('returns an error if an invalid value is provided', async () => {
	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: 'asldkjf',
			value: -10,
		})
		.expect(400);

	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			title: 'laskdfj',
		})
		.expect(400);
});

it('creates an item with valid inputs', async () => {
	let items = await Item.find({});
	expect(items.length).toEqual(0);

	const type = 'product';
	const title = 'lawnmower';
	const category = 'Home & Garden';
	const description = 'used lawnmower';
	const value = 20;
	const user = 'test';
	const itemPicture = 'https://example.com/test-image.jpg';

	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			type,
			title,
			category,
			description,
			value,
			user,
			itemPicture,
		})
		.expect(201);

	items = await Item.find({});
	expect(items.length).toEqual(1);
	expect(items[0].value).toEqual(20);
	expect(items[0].title).toEqual(title);
});

it('publishes an event', async () => {
	const type = 'product';
	const title = 'lawnmower';
	const category = 'Home & Garden';
	const description = 'used lawnmower';
	const value = 20;
	const user = 'test';
	const itemPicture = 'https://example.com/test-image.jpg';

	await request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			type,
			title,
			category,
			description,
			value,
			user,
			itemPicture,
		})
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
