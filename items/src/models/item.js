const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: true,
		},
		user: {
			type: Object,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		status: {
			type: String,
			default: 'listed',
		},
		itemPicture: {
			type: String,
			default: null,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

const Item = mongoose.model('Item', itemSchema);

module.exports = { Item };
