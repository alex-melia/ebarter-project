const request = require('supertest');
const { app } = require('../../app');

it('fails when an email that does not exist is supplied', async () => {
	await request(app)
		.post('/api/auth/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/auth/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(201);

	await request(app)
		.post('/api/auth/signin')
		.send({
			email: 'alexmelia41@gmail.com',
			password: 'a',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(400);
});

it('responds with cookie when given valid credentials', async () => {
	await request(app)
		.post('/api/auth/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(201);

	const response = await request(app)
		.post('/api/auth/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
