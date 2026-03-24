// User controller
const { query } = require('../config/database');

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics (admin only)
const getUserStatistics = async (req, res, next) => {
  try {
    // Total users
    const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Total orders
    const totalOrdersResult = await query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(totalOrdersResult.rows[0].count);

    // Total revenue
    const totalRevenueResult = await query('SELECT SUM(total_price) as total FROM orders');
    const totalRevenue = totalRevenueResult.rows[0].total || 0;

    // Recent users
    const recentUsersResult = await query(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        recentUsers: recentUsersResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStatistics,
};
