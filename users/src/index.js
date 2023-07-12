const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { natsWrapper } = require('./nats-wrapper');
const {
  ItemDeletedListener,
} = require('./events/listeners/item-deleted-listener');

const {
  TradeCreatedListener,
} = require('./events/listeners/trade-created-listener');

dotenv.config({ path: './config.env' });

const { app } = require('./app');

const users_DB = process.env.USERS_DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectToDB = async () => {
  try {
    await natsWrapper.connect('ebarter', 'baskjf', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('NATS Connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ItemDeletedListener(natsWrapper.client).listen();
    new TradeCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(users_DB);
    console.log('Connected to Users DB......');
  } catch (err) {
    console.error(err);
  }
};

const start = async () => {
  console.log('starting....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWY_KEY must be defined');
  }
  if (!process.env.USERS_DATABASE) {
    throw new Error('Users database incorrectly defined');
  }

  connectToDB();

  app.listen(3000, () => {
    console.log('Listening on port 3000..!!!');
  });
};
start();
//
