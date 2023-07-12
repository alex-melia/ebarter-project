const express = require('express');
const { body } = require('express-validator');
const requireAuth = require('../middlewares/require-auth');
const validateRequest = require('../middlewares/validate-request');
const { Trade } = require('../models/trade');

const router = express.Router();

const isObject = (obj) => typeof obj === 'object' && obj !== null;

router.post(
  '/api/trades',
  requireAuth,
  [
    body('initiator')
      .custom(isObject)
      .not()
      .isEmpty()
      .withMessage('initiator is required'),
    body('receiver')
      .custom(isObject)
      .not()
      .isEmpty()
      .withMessage('receiver is required'),
    body('initiatorItem')
      .custom(isObject)
      .not()
      .isEmpty()
      .withMessage('You must select one of your items!'),
    body('receiverItem')
      .custom(isObject)
      .not()
      .isEmpty()
      .withMessage('You must select one of their items!'),
  ],
  validateRequest,
  async (req, res) => {
    const { initiator, receiver, initiatorItem, receiverItem } = req.body;

    const trade = await Trade.create({
      initiator: initiator,
      receiver: receiver,
      initiatorItem: initiatorItem,
      receiverItem: receiverItem,
    });

    trade.save();

    res.status(201).send(trade);
  }
);

module.exports = router;
