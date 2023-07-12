const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const { natsWrapper } = require('../../nats-wrapper');
const { Trade } = require('../../models/trade');

natsWrapper.client = {
	publish: jest.fn().mockImplementation((subject, data, callback) => {
		callback();
	}),
};

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/trades/${id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'receiver-completed',
		})
		.expect(404);
});

it('returns a 200 and updates the trade status with valid trade ID', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'initiator-completed',
		initiator: { id: '1', f_name: 'John' },
		receiver: { id: '2', f_name: 'Jane' },
		initiatorItem: { id: '1', title: 'test1' },
		receiverItem: { id: '2', title: 'test2' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'receiver-completed',
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.status).toEqual('completed');
});

it('updates the trade status to "completed" if current status is "initiator-completed" and new status is "receiver-completed"', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'initiator-completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'receiver-completed',
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.status).toEqual('completed');
});

it('updates the trade status to "completed" if current status is "receiver-completed" and new status is "initiator-completed"', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'receiver-completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'initiator-completed',
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.status).toEqual('completed');
});

it('publishes an event when the trade status is updated to "accepted"', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'requested',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'accepted',
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('deletes the trade when the status is updated to "rejected"', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'requested',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			status: 'rejected',
		})
		.expect(200);

	const deletedTrade = await Trade.findById(trade._id);
	expect(deletedTrade).toBeNull();
});

it('updates the review status for initiator and receiver correctly', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/review/${trade._id}`)
		.set('Cookie', global.signin())
		.send({
			userId: 'initiatorId',
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.initiatorSentReview).toEqual(true);
});

it('updates the review status for the initiator', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/review/${trade._id}`)
		.send({
			userId: trade.initiator.id,
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.initiatorSentReview).toBe(true);
});

it('updates the review status for the receiver', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/review/${trade._id}`)
		.send({
			userId: trade.receiver.id,
		})
		.expect(200);

	const updatedTrade = await Trade.findById(trade._id);
	expect(updatedTrade.receiverSentReview).toBe(true);
});

it('returns a 404 if the trade does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/trades/review/${id}`)
		.send({
			userId: 'anyUserId',
		})
		.expect(404);
});

it('returns a 400 if the userId does not match initiator or receiver', async () => {
	const trade = new Trade({
		_id: new mongoose.Types.ObjectId().toHexString(),
		status: 'completed',
		initiator: { id: 'initiatorId' },
		receiver: { id: 'receiverId' },
		initiatorItem: { id: 'initiatorItemId' },
		receiverItem: { id: 'receiverItemId' },
	});
	await trade.save();

	await request(app)
		.put(`/api/trades/review/${trade._id}`)
		.send({
			userId: 'someOtherUserId',
		})
		.expect(400);
});
