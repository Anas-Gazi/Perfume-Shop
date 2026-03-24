// User routes
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getUserStatistics } = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);
router.get('/stats', authenticateToken, authorizeAdmin, getUserStatistics);
router.get('/:id', authenticateToken, authorizeAdmin, getUserById);

module.exports = router;
