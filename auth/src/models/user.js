const mongoose = require('mongoose');
const Password = require('../services/password');

const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		f_name: {
			type: String,
			required: true,
		},
		l_name: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			default: false,
			required: true,
		},
		otp: {
			value: {
				type: String,
			},
			expiresAt: {
				type: Date,
				default: otpExpiry,
				required: false,
			},
		},
		resetToken: {
			value: {
				type: String,
			},
			expiresAt: {
				type: Date,
			},
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.index({ 'otp.expiresAt': 1 }, { expireAfterSeconds: 5 });

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
