const request = require('supertest');
const { app } = require('../../app');

const createItem = () => {
	return request(app)
		.post('/api/items')
		.set('Cookie', global.signin())
		.send({
			type: 'product',
			title: 'football',
			category: 'sports',
			description: 'used football',
			value: 20,
			user: { name: 'geoff' },
			itemPicture: 'http://www.example-image.com/asdasd2',
		});
};

it('can fetch a list of items', async () => {
	await createItem();
	await createItem();
	await createItem();

	const response = await request(app).get('/api/items').send().expect(200);

	expect(response.body.length).toEqual(3);
}, 100000);
