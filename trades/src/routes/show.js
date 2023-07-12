const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { Trade } = require('../models/trade');

const router = express.Router();

router.get('/api/trades/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      throw new NotFoundError();
    }

    res.send(trade);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    } else {
      next(err);
    }
  }
});

router.get('/api/trades/byuser/:id', async (req, res) => {
  const trades = await Trade.find({
    $and: [
      {
        $or: [
          { 'initiator.id': req.params.id },
          { 'receiver.id': req.params.id },
        ],
      },
      { status: { $ne: 'rejected' } },
    ],
  });

  if (!trades) {
    throw new NotFoundError();
  }

  res.send(trades);
});

module.exports = router;
