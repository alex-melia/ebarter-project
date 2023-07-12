const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { natsWrapper } = require('../../nats-wrapper');
const jwt = require('jsonwebtoken');

natsWrapper.client = {
	publish: jest.fn().mockImplementation((subject, data, callback) => {
		callback();
	}),
};

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/users/${id}`)
		.set('Cookie', global.signin())
		.send({
			f_name: 'new f_name',
			l_name: 'new l_name',
			bio: 'new bio',
		})
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/users/${id}`)
		.send({
			f_name: 'new f_name',
			l_name: 'new l_name',
			bio: 'new bio',
		})
		.expect(401);
});

it('returns 400 if the user provides an invalid details', async () => {
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

	const createCookie = () => {
		const payload = {
			id: user.id,
			email: 'test@test.com',
		};

		const token = jwt.sign(payload, process.env.JWT_KEY);

		const session = { jwt: token };

		const sessionJSON = JSON.stringify(session);

		const base64 = Buffer.from(sessionJSON).toString('base64');

		return [`session=${base64}`];
	};

	const cookie = createCookie();

	await request(app)
		.put(`/api/users/${user.id}`)
		.set('Cookie', cookie)
		.send({
			f_name: 'n',
			l_name: 'new l_name',
			bio: '',
		})
		.expect(400);
});

it('updates the user provided if inputs are valid', async () => {
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

	const createCookie = () => {
		const payload = {
			id: user.id,
			email: 'test@test.com',
		};

		const token = jwt.sign(payload, process.env.JWT_KEY);

		const session = { jwt: token };

		const sessionJSON = JSON.stringify(session);

		const base64 = Buffer.from(sessionJSON).toString('base64');

		return [`session=${base64}`];
	};

	const cookie = createCookie();

	await request(app)
		.put(`/api/users/${user.id}`)
		.set('Cookie', cookie)
		.send({
			f_name: 'new f_name',
			l_name: 'new l_name',
			bio: 'new bio',
		})
		.expect(200);

	const userResponse = await request(app).get(`/api/users/${user.id}`).send();

	expect(userResponse.body.f_name).toEqual('new f_name');
	expect(userResponse.body.l_name).toEqual('new l_name');
	expect(userResponse.body.bio).toEqual('new bio');
});

it('publishes an event', async () => {
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

	const createCookie = () => {
		const payload = {
			id: user.id,
			email: 'test@test.com',
		};

		const token = jwt.sign(payload, process.env.JWT_KEY);

		const session = { jwt: token };

		const sessionJSON = JSON.stringify(session);

		const base64 = Buffer.from(sessionJSON).toString('base64');

		return [`session=${base64}`];
	};

	const cookie = createCookie();

	await request(app)
		.put(`/api/users/${user.id}`)
		.set('Cookie', cookie)
		.send({
			f_name: 'new f_name',
			l_name: 'new l_name',
			bio: 'new bio',
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
