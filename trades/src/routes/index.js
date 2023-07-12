const express = require('express');
const { requireAuth } = require('../middlewares/require-auth');
const { Trade } = require('../models/trade');

const router = express.Router();

router.get('/api/trades', requireAuth, async (req, res) => {
	const trades = await Trade.find({
		user_1: req.currentUser.id,
	});
	res.send(trades);
});

module.exports = router;
