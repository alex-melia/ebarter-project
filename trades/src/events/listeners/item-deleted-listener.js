const { Listener } = require('../base-listener');
const { Subjects } = require('../subjects');
const { queueGroupName } = require('./queue-group-name');
const { Trade } = require('../../models/trade');
const {
  ItemStatusUpdatedPublisher,
} = require('../publishers/item-status-updated-publisher');
const { natsWrapper } = require('../../nats-wrapper');

class ItemDeletedListener extends Listener {
  constructor(client, queueGroupName) {
    super(client);
    this.subject = Subjects.ItemDeleted;
    this.queueGroupName = queueGroupName;
  }

  async onMessage(data, msg) {
    const itemId = data.id;
    const ongoingTrades = await Trade.find({
      $or: [{ 'initiatorItem.id': itemId }, { 'receiverItem.id': itemId }],
      status: {
        $nin: ['completed', 'initiator-completed', 'receiver-completed'],
      },
    });

    for (const trade of ongoingTrades) {
      if (trade.initiatorItem.id === itemId) {
        console.log();
        new ItemStatusUpdatedPublisher(natsWrapper.client).publish({
          itemId: trade.receiverItem.id,
          status: 'listed',
        });
      } else if (trade.receiverItem.id === itemId) {
        new ItemStatusUpdatedPublisher(natsWrapper.client).publish({
          itemId: trade.initiatorItem.id,
          status: 'listed',
        });
      }
    }

    const deletedTrades = await Trade.deleteMany({
      $or: [{ 'initiatorItem.id': itemId }, { 'receiverItem.id': itemId }],
      status: {
        $nin: ['completed', 'initiator-completed', 'receiver-completed'],
      },
    });

    if (!deletedTrades) {
      throw new Error('Trade not found');
    }

    msg.ack();
  }
}

module.exports = { ItemDeletedListener };
