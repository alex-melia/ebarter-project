const express = require('express');
const { json } = require('body-parser');
const cookieSession = require('cookie-session');
const NotFoundError = require('./errors/not-found-error');
const currentUser = require('./middlewares/current-user');
const errorHandler = require('./middlewares/error-handler');

// Start app
const app = express();

// Routes
const createItemRouter = require('./routes/new');
const showItemRouter = require('./routes/show');
const indexItemRouter = require('./routes/index');
const updateItemRouter = require('./routes/update');
const deleteItemRouter = require('./routes/delete');
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

app.use(createItemRouter);
app.use(showItemRouter);
app.use(indexItemRouter);
app.use(updateItemRouter);
app.use(deleteItemRouter);
app.use(uploadRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

module.exports = { app };
