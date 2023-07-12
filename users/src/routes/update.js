const express = require('express');
const { body } = require('express-validator');

const validateRequest = require('../middlewares/validate-request');
const NotFoundError = require('../errors/not-found-error');
const requireAuth = require('../middlewares/require-auth');
const NotAuthorizedError = require('../errors/not-authorized-error');
const { User } = require('../models/user');
const {
  UserUpdatedPublisher,
} = require('../events/publishers/user-updated-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.put(
  '/api/users/:id',
  requireAuth,
  [
    body('f_name')
      .trim()
      .isLength({ min: 2, max: 16 })
      .withMessage('First name must be between 4 and 20 characters'),
    body('l_name')
      .trim()
      .isLength({ min: 2, max: 16 })
      .withMessage('Last name must be between 2 and 16 characters'),
    body('bio')
      .trim()
      .isLength({ min: 2, max: 128 })
      .withMessage('Biography must be between 2 and 128 characters'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new NotFoundError();
      }

      if (user.id !== req.currentUser.id) {
        throw new NotAuthorizedError();
      }

      user.set({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        bio: req.body.bio,
        profilePicture: req.body.profilePicture || user.profilePicture,
      });

      new UserUpdatedPublisher(natsWrapper.client).publish({
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        profilePicture: user.profilePicture,
      });

      user.save();

      res.send(user);
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

router.put('/api/users/review/:id', requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError();
  }

  const { ratingValue, ratingComment } = req.body;

  const newRating = {
    ratingValue,
    ratingComment,
  };

  user.ratings.push(newRating);
  user.ratingCount = user.ratings.length;
  user.ratingAverage =
    user.ratings.reduce((sum, rating) => sum + rating.ratingValue, 0) /
    user.ratingCount;

  await user.save();
  res.send('User deleted');

  res.send(user);
});

router.put('/api/users/favourites/:id', requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);

  const { item, type } = req.body;

  console.log(item);

  if (!user) {
    throw new NotFoundError();
  }

  if (!item || !item.id || (type !== 'add' && type !== 'remove')) {
    return res
      .status(400)
      .send({ error: 'Item data or request type is missing or invalid.' });
  }

  if (type === 'add') {
    user.favourites.push(item);
  } else {
    user.favourites = user.favourites.filter(
      (favouriteItem) => favouriteItem.id !== item.id
    );
  }

  await user.save();
  res.send(user);
});

module.exports = router;
