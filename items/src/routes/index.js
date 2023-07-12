const express = require('express');
const { Item } = require('../models/item');

const router = express.Router();

router.get('/api/items', async (req, res) => {
  const items = await Item.find();

  res.send(items);
});

module.exports = router;
