// Authentication controller
const { query } = require('../config/database');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const { validate, registerSchema, loginSchema } = require('../utils/validation');

// User registration
const register = async (req, res, next) => {
  try {
    const { name, email, password, gender } = validate(registerSchema, req.body);

    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Password is hashed with bcrypt before persistence.
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await query(
      'INSERT INTO users (name, email, password, gender, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, gender, role',
      [name, email, hashedPassword, gender || null, 'user']
    );

    const user = result.rows[0];
    // Token includes role so authorization checks can run without extra DB lookups.
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { email, password } = validate(loginSchema, req.body);

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = result.rows[0];

    // Compare plaintext password with stored bcrypt hash.
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, gender, role, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

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

module.exports = {
  register,
  login,
  getCurrentUser,
};
