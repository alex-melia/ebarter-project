const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { natsWrapper } = require('../../nats-wrapper');

natsWrapper.client = {
  publish: jest.fn().mockImplementation((subject, data, callback) => {
    callback();
  }),
};

it('returns a 404 if the item is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/items/${id}`).send().expect(404);
}, 20000);

it('returns the item if the items is found', async () => {
  const type = 'product';
  const title = 'lawnmower';
  const category = 'Home & Garden';
  const description = 'used lawnmower';
  const value = 20;
  const user = 'test';
  const itemPicture = 'https://example.com/test-image.jpg';

  const response = await request(app)
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

  const itemResponse = await request(app)
    .get(`/api/items/${response.body.id}`)
    .send()
    .expect(200);

  expect(itemResponse.body.title).toEqual(title);
  expect(itemResponse.body.value).toEqual(value);
}, 20000);
