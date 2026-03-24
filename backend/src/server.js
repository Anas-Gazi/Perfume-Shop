// Server startup file
require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./config/database');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✓ Database initialized');

    // Start listening   console.log(`✓ Server running on http://localhost:${PORT}`); for dev perpose on vs code
    app.listen(PORT, () => {
      console.log(`✓ Server running on ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Documentation:`);
      console.log(`  - GET    http://localhost:${PORT}/health - Health check`);
      console.log(`  - POST   http://localhost:${PORT}/api/auth/register - Register`);
      console.log(`  - POST   http://localhost:${PORT}/api/auth/login - Login`);
      console.log(`  - GET    http://localhost:${PORT}/api/products - Get products`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
