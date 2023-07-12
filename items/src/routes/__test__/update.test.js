const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { natsWrapper } = require('../../nats-wrapper');

natsWrapper.client = {
  publish: jest.fn().mockImplementation((subject, data, callback) => {
    callback();
  }),
};

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/items/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      category: 'Home & Garden',
      description: 'test',
      value: 20,
      user: { id: '12312', f_name: 'john' },
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/items/${id}`)
    .send({
      title: 'aslkdfj',
      value: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the item', async () => {
  const type = 'product';
  const title = 'lawnmower';
  const category = 'Home & Garden';
  const description = 'used lawnmower';
  const value = 20;
  const user = 'test';
  const itemPicture = 'https://example.com/test-image.jpg';

  const createItemResponse = await request(app)
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
    });

  const updateItemResponse = await request(app)
    .put(`/api/items/${createItemResponse.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new title',
      category: 'new category',
      description: 'new description',
      value: 1000,
    });

  expect(updateItemResponse.status).toEqual(401);
});

it('returns a 400 if the user provides an invalid title or value', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      value: 20,
    });

  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      value: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      value: -10,
    })
    .expect(400);
});

it('updates the item provided valid inputs', async () => {
  const cookie = global.signin();

  const type = 'product';
  const title = 'lawnmower';
  const category = 'Home & Garden';
  const description = 'used lawnmower';
  const value = 20;
  const user = { id: '12345', f_name: 'test' };
  const itemPicture = 'https://example.com/test-image.jpg';

  const response = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      type,
      title,
      category,
      description,
      value,
      user,
      itemPicture,
    });

  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      category: 'Home & Garden',
      description: 'new description',
      value: 1000,
    })
    .expect(200);

  const itemResponse = await request(app)
    .get(`/api/items/${response.body.id}`)
    .send();

  expect(itemResponse.body.title).toEqual('new title');
  expect(itemResponse.body.value).toEqual(1000);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const type = 'product';
  const title = 'lawnmower';
  const category = 'Home & Garden';
  const description = 'used lawnmower';
  const value = 20;
  const user = { id: '12345', f_name: 'test' };
  const itemPicture = 'https://example.com/test-image.jpg';

  const response = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({
      type,
      title,
      category,
      description,
      value,
      user,
      itemPicture,
    });

  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      category: 'Home & Garden',
      description: 'new description',
      value: 1000,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
