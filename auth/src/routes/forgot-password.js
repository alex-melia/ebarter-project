const express = require('express');
const validateRequest = require('../middlewares/validate-request');
const { body } = require('express-validator');
const { User } = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const sendPasswordReset = require('../middlewares/send-password-reset');
const crypto = require('crypto');

const router = express.Router();

router.post(
	'/api/auth/forgot-password',
	[body('email').isEmail().withMessage('Email must be valid')],
	validateRequest,
	async (req, res) => {
		const { email } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError('This email is not in use!');
		}

		// Generate reset token
		const reset_token_value = crypto.randomBytes(20).toString('hex');

		existingUser.resetToken = {
			value: reset_token_value,
			expiresAt: Date.now() + 10 * 60 * 1000,
		};

		existingUser.otp = undefined;

		try {
			await existingUser.save();
			sendPasswordReset(email, reset_token_value);
			res.status(200).send({ success: 'Reset email sent' });
		} catch (err) {
			console.error(err);
			res.status(500).send({ error: 'Error' });
		}
	}
);

module.exports = router;
