const express = require('express');
const { body } = require('express-validator');
const requireAuth = require('../middlewares/require-auth');
const validateRequest = require('../middlewares/validate-request');
const { Item } = require('../models/item');
const {
	ItemCreatedPublisher,
} = require('../events/publishers/item-created-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.post(
	'/api/items',
	requireAuth,
	[
		body('type').not().isEmpty().withMessage('Type is required'),
		body('title').not().isEmpty().withMessage('Title is required'),
		body('category').not().isEmpty().withMessage('Category is required'),
		body('description').not().isEmpty().withMessage('Description is required'),
		body('value').isNumeric().withMessage('Value must be number'),
	],
	validateRequest,
	async (req, res) => {
		const { type, title, category, description, value, user, itemPicture } =
			req.body;
		const item = await Item.create({
			type,
			title,
			category,
			description,
			value,
			user,
			itemPicture,
		});

		item.save();

		new ItemCreatedPublisher(natsWrapper.client).publish({
			id: item.id,
			type: item.type,
			title: item.title,
			category: item.category,
			description: item.description,
			value: item.value,
			user: item.user,
		});
		res.status(201).send(item);
	}
);

module.exports = router;
