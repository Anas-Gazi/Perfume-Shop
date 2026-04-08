// Product routes
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getHomeSections,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require(
  '../controllers/productController'
);
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllProducts);
router.get('/home-sections', getHomeSections);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticateToken, authorizeAdmin, upload.array('images', 5), createProduct);
router.put('/:id', authenticateToken, authorizeAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

module.exports = router;
