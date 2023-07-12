const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { User } = require('../models/user');
const {
  UserDeletedPublisher,
} = require('../events/publishers/user-deleted-publisher');
const { natsWrapper } = require('../nats-wrapper');

const router = express.Router();

router.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new NotFoundError();
    }

    new UserDeletedPublisher(natsWrapper.client).publish({
      id: user.id,
    });
    res.send('User deleted');
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    }
  }
});

router.delete('/api/users/favourites/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { item } = req.body;

    if (!user) {
      throw new NotFoundError();
    }

    if (!item || !item.id) {
      throw new NotFoundError();
    }

    const initialFavouritesCount = user.favourites.length;

    user.favourites = user.favourites.filter(
      (favouriteItem) => favouriteItem.id !== item.id
    );

    if (user.favourites.length === initialFavouritesCount) {
      throw new NotFoundError();
    }

    await user.save();
    res.send('asd');
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    }
  }
});

module.exports = router;
