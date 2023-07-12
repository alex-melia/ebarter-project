const express = require('express');
const validateRequest = require('../middlewares/validate-request');
const { body } = require('express-validator');
const { User } = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
  '/api/auth/verify-otp',
  [body('otp').trim()],
  validateRequest,
  async (req, res) => {
    const { user_id, otp } = req.body;
    const user = await User.findById(user_id);

    if (!user) {
      throw new BadRequestError(
        'Your OTP has expired or your account is invalid!'
      );
    }

    if (otp === user.otp.value) {
      user.verified = true;
      delete user.otp;
      await user.save();
      await user.updateOne({ $unset: { otp: 1 } });

      const userJwt = jwt.sign(
        {
          id: user.id,
          f_name: user.f_name,
          l_name: user.l_name,
          email: user.email,
          role: 'user',
          verified: user.verified,
        },
        process.env.JWT_KEY
      );

      req.session.jwt = userJwt;

      res.status(200).send({ success: 'OTP verified, user logged in' });
    } else {
      res.status(400).send({ error: 'Invalid OTP' });
    }
  }
);

module.exports = router;
