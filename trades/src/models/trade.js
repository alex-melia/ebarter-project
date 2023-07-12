const mongoose = require('mongoose');
const { User } = require('./user');

const tradeSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			enum: [
				'requested',
				'accepted',
				'rejected',
				'initiator-completed',
				'receiver-completed',
				'completed',
			],
			default: 'requested',
			required: true,
		},
		initiator: {
			type: Object,
			required: true,
		},
		receiver: {
			type: Object,
			required: true,
		},
		initiatorItem: {
			type: Object,
			required: true,
		},
		receiverItem: {
			type: Object,
			required: true,
		},
		initiatorSentReview: {
			type: Boolean,
			default: false,
		},
		receiverSentReview: {
			type: Boolean,
			default: false,
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
//
const Trade = mongoose.model('Trade', tradeSchema);

module.exports = { Trade };
