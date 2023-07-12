const express = require('express');
const { body } = require('express-validator');
const BadRequestError = require('../errors/bad-request-error');
const { User } = require('../models/user');
const validateRequest = require('../middlewares/validate-request');
const sendOTP = require('../middlewares/send-otp');

const router = express.Router();

router.post(
  '/api/auth/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('f_name')
      .trim()
      .isLength({ min: 2, max: 16 })
      .withMessage('First name must be between 2 and 16 characters'),
    body('l_name')
      .trim()
      .isLength({ min: 2, max: 16 })
      .withMessage('Last name must be between 2 and 16 characters'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password, f_name, l_name, profilePicture } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // Generate OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000);

    // Send OTP email
    sendOTP(email, otpValue);

    const otp = {
      value: otpValue,
    };

    const user = await User.create({
      email,
      password,
      f_name,
      l_name,
      otp,
      profilePicture,
    });

    user.set({
      profilePicture: profilePicture,
    });
    user.save();

    res.status(201).send(user);
  }
);

module.exports = router;
