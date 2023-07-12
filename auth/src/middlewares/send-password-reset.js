const nodemailer = require('nodemailer');

module.exports = sendPasswordReset = async (toEmail, reset_token_value) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'ebartersite@gmail.com',
			pass: 'vxjdcvbqvzrpjwgd',
		},
	});

	const mailOptions = {
		from: 'ebartersite@gmail.com',
		to: toEmail,
		subject: 'Password Reset',
		html: `<p>Click 'https://ebarter.dev/auth/reset-password?token=${reset_token_value}'>here</a> to reset password</p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`Reset email sent to: ${toEmail}`);
	} catch (error) {
		console.log(`Reset email sending failed: ${error}`);
	}
};
