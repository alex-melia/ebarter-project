const express = require('express');

const { Chat } = require('../models/chat');

const router = express.Router();

router.get('/api/chats/byuser/:id', async (req, res) => {
	const chats = await Chat.find({
		$or: [{ 'initiator.id': req.params.id }, { 'receiver.id': req.params.id }],
	});

	if (!chats) {
		throw new NotFoundError();
	}

	res.send(chats);
});

module.exports = router;
