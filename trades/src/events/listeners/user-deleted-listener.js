const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Trade } = require('../../models/trade');
const {
  ItemStatusUpdatedPublisher,
} = require('../publishers/item-status-updated-publisher');
const { natsWrapper } = require('../../nats-wrapper');

class UserDeletedListener extends Listener {
  constructor(client, queueGroupName) {
    super(client);
    this.subject = Subjects.UserDeleted;
    this.queueGroupName = queueGroupName;
  }

  async onMessage(data, msg) {
    const userId = data.id;
    const ongoingTrades = await Trade.find({
      $or: [{ 'initiator.id': userId }, { 'receiver.id': userId }],
      status: { $ne: 'completed' },
    });

    for (const trade of ongoingTrades) {
      if (trade.initiator.id === userId) {
        console.log();
        new ItemStatusUpdatedPublisher(natsWrapper.client).publish({
          itemId: trade.receiverItem.id,
          status: 'listed',
        });
      } else if (trade.receiver.id === userId) {
        new ItemStatusUpdatedPublisher(natsWrapper.client).publish({
          itemId: trade.initiatorItem.id,
          status: 'listed',
        });
      }
    }

    const deletedTrades = await Trade.deleteMany({
      $or: [{ 'initiator.id': userId }, { 'receiver.id': userId }],
      status: { $ne: 'completed' },
    });

    if (!deletedTrades) {
      throw new Error('Trade not found');
    }

    msg.ack();
  }
}

module.exports = { UserDeletedListener };
