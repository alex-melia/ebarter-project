const express = require('express');
const NotFoundError = require('../errors/not-found-error');
const { Trade } = require('../models/trade');

const router = express.Router();

router.delete('/api/trades/:id', async (req, res) => {
	console.log(req.params);
	const trade = await Trade.findByIdAndDelete(req.params.id);

	if (!trade) {
		throw new NotFoundError();
	}

	res.send('Trade deleted');
});

module.exports = router;
