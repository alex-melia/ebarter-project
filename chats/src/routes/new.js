const express = require('express');
const { Chat } = require('../models/chat');
const router = express.Router();

router.post('/api/chats', async (req, res) => {
	const { initiator, receiver } = req.body;

	const chat = await Chat.create({
		initiator: initiator,
		receiver: receiver,
	});

	chat.save();

	res.status(201).send(chat);
});

module.exports = router;
