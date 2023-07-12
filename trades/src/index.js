const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { natsWrapper } = require('./nats-wrapper');

const {
  UserUpdatedListener,
} = require('./events/listeners/user-updated-listener');

const {
  UserDeletedListener,
} = require('./events/listeners/user-deleted-listener');

const {
  ItemDeletedListener,
} = require('./events/listeners/item-deleted-listener');

dotenv.config({ path: './config.env' });

const { app } = require('./app');

const trades_DB = process.env.TRADES_DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectToDB = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS Connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new UserDeletedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new ItemDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(trades_DB);
    console.log('Connected to Trades DB.....');
  } catch (err) {
    console.error(err);
  }
};

const start = async () => {
  console.log('starting');
  if (!process.env.TRADES_DATABASE) {
    throw new Error('Trades database incorrectly defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI incorrectly defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be  defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  connectToDB();

  app.listen(3000, () => {
    console.log('Listening on port 3000...!!!!');
  });
};
//
start();
