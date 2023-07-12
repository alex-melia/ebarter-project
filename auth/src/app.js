const express = require('express');
const { User } = require('./models/user');
const cookieSession = require('cookie-session');

require('express-async-errors');
const { json } = require('body-parser');

// Start app
const app = express();

// Routes
const currentUserRouter = require('./routes/current-user');
const signInRouter = require('./routes/signin');
const signOutRouter = require('./routes/signout');
const signUpRouter = require('./routes/signup');
const verifyOtpRouter = require('./routes/verify-otp');
const forgotPasswordRouter = require('./routes/forgot-password');
const resetPasswordRouter = require('./routes/reset-password');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-error');

// Middlewares
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use(verifyOtpRouter);
app.use(forgotPasswordRouter);
app.use(resetPasswordRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});
//
app.use(errorHandler);

module.exports = { app };
