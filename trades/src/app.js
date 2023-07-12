const express = require('express');
const { json } = require('body-parser');
const cookieSession = require('cookie-session');
const NotFoundError = require('./errors/not-found-error');
const currentUser = require('./middlewares/current-user');
const errorHandler = require('./middlewares/error-handler');

// Start app
const app = express();

// Routes
const createTradeRouter = require('./routes/new');
const showTradeRouter = require('./routes/show');
const updateTradeRouter = require('./routes/update');

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

app.use(createTradeRouter);
app.use(showTradeRouter);
app.use(updateTradeRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});
app.use(errorHandler);

module.exports = { app };
