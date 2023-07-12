const mongoose = require('mongoose');
const Password = require('../services/password');

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
		bio: {
			type: String,
			default: "Hi! I'm trading on E-Barter!",
			required: true,
		},
		items: {
			type: Array,
		},
		verified: {
			type: Boolean,
			default: false,
			required: true,
		},
		ratingAverage: {
			type: Number,
			default: 0.0,
			required: true,
		},
		ratingCount: {
			type: Number,
			default: 0,
			required: true,
		},
		ratings: {
			type: Array,
		},
		favourites: {
			type: Array,
		},
		profilePicture: {
			type: String,
			default: null,
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

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
