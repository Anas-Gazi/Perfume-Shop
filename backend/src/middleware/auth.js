// Authentication middleware
const { verifyToken } = require('../utils/auth');

// Verify JWT middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // verifyToken throws when token is invalid/expired; this is handled in catch block.
    const decoded = verifyToken(token);
    // Attach identity to request so downstream handlers do not re-parse JWT.
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Verify admin role middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
};
