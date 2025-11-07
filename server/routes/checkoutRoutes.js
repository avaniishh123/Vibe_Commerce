const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/checkoutController');

// POST /api/checkout - Process checkout
router.post('/', processCheckout);

module.exports = router;
