// Order routes
const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Protected routes
router.post('/', authenticateToken, placeOrder);
router.get('/user/orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus);

module.exports = router;
