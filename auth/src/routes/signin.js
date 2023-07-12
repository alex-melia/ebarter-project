const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const { User } = require('../models/user');
const Password = require('../services/password');
const validateRequest = require('../middlewares/validate-request');
const BadRequestError = require('../errors/bad-request-error');

const router = express.Router();

router.post(
  '/api/auth/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must provide a password'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    if (!existingUser.verified === true) {
      throw new BadRequestError('Your account must be verified!');
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        f_name: existingUser.f_name,
        l_name: existingUser.l_name,
        role: 'user',
        verified: existingUser.verified,
      },
      process.env.JWT_KEY
    );

    const adminJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        f_name: existingUser.f_name,
        l_name: existingUser.l_name,
        role: 'admin',
        verified: existingUser.verified,
      },
      process.env.JWT_KEY
    );

    if (existingUser.email === 'admin@ebarter.com') {
      req.session = { jwt: adminJwt };
    } else {
      req.session = { jwt: userJwt };
    }

    res.status(200).send(existingUser);
  }
);

module.exports = router;
