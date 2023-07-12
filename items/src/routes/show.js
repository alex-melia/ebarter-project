const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { Item } = require('../models/item');

const router = express.Router();

router.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new NotFoundError();
    }

    res.send(item);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    } else {
      next(err);
    }
  }
});

router.get('/api/items/byuser/:id', async (req, res) => {
  const { id: userId } = req.params;
  const items = await Item.find({ 'user.id': userId });

  if (!items) {
    throw new NotFoundError();
  }

  res.send(items);
});

router.get('/api/items/favourites/:id', async (req, res) => {
  const { id } = req.params.id;
  const items = await Item.find({ 'user.id': userId });

  if (!items) {
    throw new NotFoundError();
  }

  res.send(items);
});

module.exports = router;
