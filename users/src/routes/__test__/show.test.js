const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

it('returns a 404 if the user is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app).get(`/api/users/${id}`).send().expect(404);
}, 20000);

it('returns the user if the user exists', async () => {
	const email = 'testemail@test.com';
	const password = 'password';
	const f_name = 'test';
	const l_name = 'user';
	const otp = 12345;
	const profilePicture = null;

	const user = await User.create({
		email,
		password,
		f_name,
		l_name,
		otp,
		profilePicture,
	});

	const userResponse = await request(app)
		.get(`/api/users/${user.id}`)
		.send()
		.expect(200);

	expect(userResponse.body.email).toEqual(email);
	expect(userResponse.body.f_name).toEqual(f_name);
}, 20000);
