const express = require('express');
const validateRequest = require('../middlewares/validate-request');
const { body } = require('express-validator');
const { User } = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');

const router = express.Router();

router.post(
  '/api/auth/reset-password',
  [
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('token').trim(),
  ],
  validateRequest,
  async (req, res) => {
    const { password, token } = req.body;

    const existingUser = await User.findOne({ 'resetToken.value': token });

    if (!existingUser) {
      throw new BadRequestError('No such user exists!');
    }

    existingUser.password = password;
    existingUser.resetToken = undefined;
    existingUser.otp = undefined;

    await existingUser.save();

    res.status(200);
  }
);

module.exports = router;
