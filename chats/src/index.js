const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { natsWrapper } = require('./nats-wrapper');

const {
  UserUpdatedListener,
} = require('./events/listeners/user-updated-listener');

const {
  UserDeletedListener,
} = require('./events/listeners/user-deleted-listener');

dotenv.config({ path: './config.env' });
const { app } = require('./app');

const chats_DB = process.env.CHATS_DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectToDB = async () => {
  try {
    await natsWrapper.connect('ebarter', 'vavac', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS Connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new UserUpdatedListener(natsWrapper.client).listen();
    new UserDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(chats_DB);
    console.log('Connected to Chats DB...');
  } catch (err) {
    console.error(err);
  }
};

const start = async () => {
  console.log('starting.......');
  if (!process.env.JWT_KEY) {
    throw new Error('JWY_KEY must be defined');
  }
  if (!process.env.CHATS_DATABASE) {
    throw new Error('Chats database incorrectly defined');
  }

  connectToDB();

  app.listen(3000, () => {
    console.log('Listening on port 3000...!!!');
  });
};

start();
