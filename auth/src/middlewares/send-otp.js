const nodemailer = require('nodemailer');

module.exports = sendOTP = async (toEmail, otp) => {
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
		subject: 'OTP verification',
		html: `<p>Your OTP is <b>${otp}</b></p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`OTP email sent to: ${toEmail}`);
	} catch (error) {
		console.log(`OTP email sending failed: ${error}`);
	}
};
