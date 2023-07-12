const request = require('supertest');
const { app } = require('../../app');
const { User } = require('../../models/user');

it('can fetch a list of users', async () => {
	const users = await User.find({});

	const usersLength = users.length;

	const response = await request(app).get('/api/users').send().expect(200);
	expect(response.body.length).toEqual(usersLength);
});
