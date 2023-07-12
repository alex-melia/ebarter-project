const mongoose = require('mongoose');

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
		items: {
			type: Array,
		},
		verified: {
			type: Boolean,
			default: false,
			required: true,
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
