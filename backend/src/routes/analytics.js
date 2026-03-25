const express = require('express');
const router = express.Router();
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.get('/overview', authenticateToken, authorizeAdmin, getAnalyticsOverview);

module.exports = router;
