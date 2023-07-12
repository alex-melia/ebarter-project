const express = require('express');
const { json } = require('body-parser');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/error-handler');

// Start app
const app = express();

//Routes
const newChatRouter = require('./routes/new');
const showChatRouter = require('./routes/show');
const updateChatRouter = require('./routes/update');

// Middlewares
app.set('trust proxy', true);
app.use(json());

app.use(newChatRouter);
app.use(showChatRouter);
app.use(updateChatRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

module.exports = { app };
