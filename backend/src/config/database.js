// Backend database configuration and connection
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Error handling for pool
pool.on('error', (err) => {
  console.error('Unexpected MySQL error', err);
});

const toMysqlQuery = (text) => text.replace(/\$(\d+)/g, '?');

const extractReturningClause = (text) => {
  const match = text.match(/\sRETURNING\s+(.+?)\s*;?\s*$/i);
  if (!match) {
    return { baseText: text.trim(), returningColumns: null };
  }

  const baseText = text.slice(0, match.index).trim();
  const returningColumns = match[1].trim();
  return { baseText, returningColumns };
};

const executePgCompatibleQuery = async (connection, text, params = []) => {
  const { baseText, returningColumns } = extractReturningClause(text);
  const mysqlQuery = toMysqlQuery(baseText);
  const [result] = await connection.execute(mysqlQuery, params);

  // For normal SELECT statements mysql2 already returns rows array.
  if (!returningColumns) {
    if (Array.isArray(result)) {
      return { rows: result, rowCount: result.length };
    }
    return { rows: [], rowCount: result.affectedRows || 0 };
  }

  // Emulate PostgreSQL RETURNING for common INSERT/UPDATE patterns used in this project.
  const normalized = baseText.trim().toUpperCase();
  let rows = [];

  if (normalized.startsWith('INSERT INTO')) {
    const tableMatch = baseText.match(/INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (tableMatch && result.insertId) {
      const tableName = tableMatch[1];
      const cols = returningColumns === '*' ? '*' : returningColumns;
      const [selectRows] = await connection.execute(
        `SELECT ${cols} FROM ${tableName} WHERE id = ?`,
        [result.insertId]
      );
      rows = selectRows;
    }
  } else if (normalized.startsWith('UPDATE')) {
    const tableMatch = baseText.match(/UPDATE\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    const whereIdMatch = toMysqlQuery(baseText).match(/\bWHERE\s+id\s*=\s*\?/i);
    const idParam = params[params.length - 1];

    if (tableMatch && whereIdMatch && result.affectedRows > 0) {
      const tableName = tableMatch[1];
      const cols = returningColumns === '*' ? '*' : returningColumns;
      const [selectRows] = await connection.execute(
        `SELECT ${cols} FROM ${tableName} WHERE id = ?`,
        [idParam]
      );
      rows = selectRows;
    }
  }

  return { rows, rowCount: rows.length || result.affectedRows || 0 };
};

// Database initialization - Create tables if they don't exist
const initializeDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        fragrance_type VARCHAR(100),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Product images table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Order items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    const indexes = [
      'CREATE INDEX idx_products_category ON products(category)',
      'CREATE INDEX idx_products_fragrance ON products(fragrance_type)',
      'CREATE INDEX idx_users_email ON users(email)',
      'CREATE INDEX idx_orders_user_id ON orders(user_id)',
      'CREATE INDEX idx_order_items_order_id ON order_items(order_id)',
      'CREATE INDEX idx_product_images_product_id ON product_images(product_id)',
    ];
    for (const indexQuery of indexes) {
      try {
        await connection.query(indexQuery);
      } catch (error) {
        // Ignore duplicate index errors so initialization is idempotent.
        if (error.code !== 'ER_DUP_KEYNAME') {
          throw error;
        }
      }
    }

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  initializeDatabase,
  query: async (text, params) => {
    const connection = await pool.getConnection();
    try {
      return await executePgCompatibleQuery(connection, text, params || []);
    } finally {
      connection.release();
    }
  },
};
