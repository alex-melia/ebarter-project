const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { Item } = require('../models/item');
const {
  ItemDeletedPublisher,
} = require('../events/publishers/item-deleted-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.delete('/api/items/:id', async (req, res) => {
  console.log(req.params);
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    throw new NotFoundError();
  }

  new ItemDeletedPublisher(natsWrapper.client).publish({
    id: item.id,
  });
  res.send('Item deleted');
});

module.exports = router;
