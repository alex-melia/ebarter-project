const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { Chat } = require('../../models/chat');

it('has a route handler listening to /api/chats for post requests', async () => {
  const response = await request(app)
    .post('/api/chats')
    .send({
      initiator: { id: '1' },
      receiver: { id: '2' },
    });

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/chats').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/chats')
    .set('Cookie', global.signin())
    .send({
      initiator: { id: '1' },
      receiver: { id: '2' },
    });

  if (response.status === 401) {
    console.log('blaaaaaaaa' + response.body);
  }

  expect(response.status).not.toEqual(401);
});

it('creates a chat successfully', async () => {
  const initiatorId = new mongoose.Types.ObjectId().toHexString();
  const receiverId = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post('/api/chats')
    .set('Cookie', global.signin())
    .send({
      initiator: { id: '1' },
      receiver: { id: '2' },
    })
    .expect(201);

  expect(response.body.initiator).toEqual(initiatorId);
  expect(response.body.receiver).toEqual(receiverId);
});

it('returns a 400 if the initiator is missing', async () => {
  const receiverId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/chats')
    .set('Cookie', global.signin())
    .send({
      receiver: receiverId,
    })
    .expect(400);
});

it('returns a 400 if the receiver is missing', async () => {
  const initiatorId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/chats')
    .set('Cookie', global.signin())
    .send({
      initiator: initiatorId,
    })
    .expect(400);
});
