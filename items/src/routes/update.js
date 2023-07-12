const express = require('express');
const { body } = require('express-validator');

const validateRequest = require('../middlewares/validate-request');
const NotFoundError = require('../errors/not-found-error');
const requireAuth = require('../middlewares/require-auth');
const NotAuthorizedError = require('../errors/not-authorized-error');
const { Item } = require('../models/item');

const {
  ItemUpdatedPublisher,
} = require('../events/publishers/item-updated-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.put(
  '/api/items/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('category').not().isEmpty().withMessage('Category is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('value').isNumeric().withMessage('Value must be number'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);

      if (!item) {
        throw new NotFoundError();
      }

      if (item.user.id !== req.currentUser.id) {
        throw new NotAuthorizedError();
      }

      item.set({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        value: req.body.value,
        itemPicture: req.body.itemPicture || item.itemPicture,
      });
      item.save();
      new ItemUpdatedPublisher(natsWrapper.client).publish({
        type: item.type,
        title: item.title,
        category: item.category,
        description: item.description,
        value: item.value,
        itemPicture: item.itemPicture,
      });

      res.send(item);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).send(err.serializeErrors());
      } else if (err instanceof NotAuthorizedError) {
        res.status(401).send(err.serializeErrors());
      } else {
        next(err);
      }
    }
  }
);

module.exports = router;
