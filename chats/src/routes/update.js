const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validate-request');
const { Chat } = require('../models/chat');

const router = express.Router();

router.put(
	'/api/chats/:id',
	[body('message').not().isEmpty().withMessage('Message is required')],
	validateRequest,
	async (req, res) => {
		const { sender, message } = req.body;

		const chat = await Chat.findById(req.params.id);

		chat.messages.push({ sender, content: message });

		await chat.save();

		res.status(201).send(chat);
	}
);

module.exports = router;
