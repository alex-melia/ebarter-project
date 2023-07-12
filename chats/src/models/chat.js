const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: Object,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

const chatSchema = new mongoose.Schema(
	{
		initiator: {
			type: Object,
			required: true,
		},
		receiver: {
			type: Object,
			required: true,
		},
		messages: [messageSchema],
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat };
