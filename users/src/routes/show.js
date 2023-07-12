const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { User } = require('../models/user');

const router = express.Router();

router.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError();
    }

    res.send(user);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send(err.serializeErrors());
    } else {
      next(err);
    }
  }
});

router.get('api/users/favourites/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError();
  }

  const favourites = user.favourites;

  res.send(favourites);
});

module.exports = router;
