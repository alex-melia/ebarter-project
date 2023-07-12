const request = require('supertest');
const { app } = require('../../app');

it('returns a 201 on successful signup', async () => {
	return request(app)
		.post('/api/auth/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(201);
});

it('returns a 400 with an invalid email', async () => {
	return request(app)
		.post('/api/auth/signup')
		.send({
			email: 'afasfasf',
			password: 'password',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(400);
});

it('returns a 400 with an invalid password', async () => {
	return request(app)
		.post('/api/auth/signup')
		.send({
			email: 'test@test.com',
			password: 'd',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(400);
});

it('returns a 400 with missing email and password', async () => {
	return request(app)
		.post('/api/auth/signup')
		.send({
			email: '',
			password: '',
		})
		.expect(400);
});

it('disallows duplicate emails', async () => {
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
		.post('/api/auth/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
			f_name: 'test',
			l_name: 'user',
		})
		.expect(400);
});
