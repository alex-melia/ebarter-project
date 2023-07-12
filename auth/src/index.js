const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { natsWrapper } = require('./nats-wrapper');

dotenv.config({ path: './config.env' });

const { app } = require('./app');

const users_DB = process.env.USERS_DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectToDB = async () => {
  try {
    await natsWrapper.connect('ebarter', 'laskjf', 'http://nats-srv:4222');
    await mongoose.connect(users_DB);
    console.log('Connected to Users DB...');
  } catch (err) {
    console.error(err);
  }
};

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWY_KEY must be defined');
  }
  if (!process.env.USERS_DATABASE) {
    throw new Error('Users database incorrectly defined');
  }
  if (!process.env.OTP_DATABASE) {
    throw new Error('OTP database incorrectly defined');
  }

  connectToDB();

  app.listen(3000, () => {
    console.log('Listening on port 3000...!!!!');
  });
};

start();
