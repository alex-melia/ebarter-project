const express = require('express');
const { json } = require('body-parser');
const cookieSession = require('cookie-session');
const NotFoundError = require('./errors/not-found-error');
const currentUser = require('./middlewares/current-user');
const errorHandler = require('./middlewares/error-handler');

// Start app
const app = express({ limit: '500mb' });

// Routes
const showUserRouter = require('./routes/show');
const indexUserRouter = require('./routes/index');
const updateUserRouter = require('./routes/update');
const deleteUserRouter = require('./routes/delete');
const uploadRouter = require('./routes/upload');

// Middlewares
app.set('trust proxy', true);
app.use(json({ limit: '500mb' }));
app.use(
	cookieSession({
		signed: false,
		secure: false,
	})
);
app.use(currentUser);

app.use(showUserRouter);
app.use(indexUserRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);
app.use(uploadRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

module.exports = { app };
