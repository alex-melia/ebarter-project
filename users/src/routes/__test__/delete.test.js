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

it('deletes a user if user exists', async () => {
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

  const response = await request(app).delete(`/api/users/${user.id}`);
  expect(response.status).toEqual(200);
});

it('responds with 404 if the user does not exist', async () => {
  const falseId = new mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/users/${falseId}`);
  expect(response.status).toEqual(404);
}, 20000);

it('deletes a favourite item if the user and the item exist', async () => {
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
    favourites: [
      {
        id: '12345',
      },
    ],
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

  // Create a user and a favourite item here, and use their ids in the request below
  const response = await request(app)
    .delete(`/api/users/favourites/${user.id}`)
    .set('Cookie', cookie)
    .send({ item: { id: 12345 } });
  expect(response.status).toEqual(200);
});

it('responds with 401 if the user is not authorized', async () => {
  const falseId = new mongoose.Types.ObjectId();
  const response = await request(app).delete(
    `/api/users/favourites/${falseId}`
  );
  expect(response.status).toEqual(401);
});

it('responds with 404 if the item does not exist', async () => {
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
    favourites: [
      {
        id: '12345',
      },
    ],
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

  const falseId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .delete(`/api/users/favourites/${user.id}`)
    .set('Cookie', cookie)
    .send({ item: { id: falseId } });
  expect(response.status).toEqual(404);
});
