const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { Trade } = require('../models/trade');
const {
  TradeCreatedPublisher,
} = require('../events/publishers/trade-created-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.put('/api/trades/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    const newStatus = req.body.status;

    if (!trade) {
      throw new NotFoundError();
    }

    if (
      (trade.status === 'initiator-completed' &&
        newStatus === 'receiver-completed') ||
      (trade.status === 'receiver-completed' &&
        newStatus === 'initiator-completed')
    ) {
      trade.status = 'completed';
    } else {
      trade.status = newStatus;
    }

    if (newStatus === 'accepted') {
      new TradeCreatedPublisher(natsWrapper.client).publish({
        initiatorItemId: trade.initiatorItem.id,
        receiverItemId: trade.receiverItem.id,
      });

      const tradesToDelete = await Trade.find({
        $or: [
          { 'initiatorItem.id': trade.initiatorItem.id },
          { 'receiverItem.id': trade.receiverItem.id },
          { 'initiatorItem.id': trade.receiverItem.id },
          { 'receiverItem.id': trade.initiatorItem.id },
        ],
        status: 'requested',
      });

      for (let tradeToDelete of tradesToDelete) {
        if (tradeToDelete.id !== trade.id) {
          await Trade.findByIdAndDelete(tradeToDelete.id);
        }
      }
    }

    if (newStatus === 'rejected') {
      await Trade.findByIdAndDelete(req.params.id);
      return res.status(200).send({});
    }

    await trade.save();
    res.send(trade);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    } else {
      res.status(500).send({ error: err.message });
    }
  }
});

router.put('/api/trades/review/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      throw new NotFoundError();
    }

    const { userId } = req.body;

    if (userId === trade.initiator.id) {
      trade.initiatorSentReview = true;
    } else if (userId === trade.receiver.id) {
      trade.receiverSentReview = true;
    } else {
      return res.status(400).send({ error: 'Invalid userId.' });
    }

    await trade.save();

    res.send(trade);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    } else {
      res.status(500).send({ error: err.message });
    }
  }
});

module.exports = router;
