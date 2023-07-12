const express = require('express');
const { User } = require('../models/user');

const router = express.Router();

router.get('/api/users', async (req, res) => {
	const users = await User.find({});
	res.send(users);
});

module.exports = router;
