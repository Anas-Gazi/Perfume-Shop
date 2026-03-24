// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    status: err.status || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
