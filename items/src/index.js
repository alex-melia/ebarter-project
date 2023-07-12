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
  TradeCreatedListener,
} = require('./events/listeners/trade-created-listener');

const {
  ItemStatusUpdatedListener,
} = require('./events/listeners/item-status-updated-listener');

dotenv.config({ path: './config.env' });

const { app } = require('./app');

const items_DB = process.env.ITEMS_DATABASE.replace(
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

    new ItemStatusUpdatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new UserDeletedListener(natsWrapper.client).listen();
    new TradeCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(items_DB);
    console.log('Connected to Items DB.....');
  } catch (err) {
    console.error(err);
  }
};

const start = async () => {
  if (!process.env.ITEMS_DATABASE) {
    throw new Error('Items database incorrectly defined');
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
