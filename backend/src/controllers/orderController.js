// Order controller
const { query } = require('../config/database');
const { validate, placeOrderSchema } = require('../utils/validation');
const { sendOrderConfirmationEmail } = require('../utils/email');

// Place order
const placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = validate(placeOrderSchema, req.body);
    const userId = req.user.userId;

    // Calculate total price and validate stock
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const productResult = await query('SELECT * FROM products WHERE id = $1', [item.productId]);

      if (productResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;
      validatedItems.push({ ...item, product });
    }

    // Create order
    const orderResult = await query(
      'INSERT INTO orders (user_id, total_price, shipping_address, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, totalPrice, shippingAddress, 'pending']
    );

    const order = orderResult.rows[0];

    // Add order items and update stock
    for (const item of validatedItems) {
      await query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.product.price]
      );

      // Update product stock
      await query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);
    }

    // Get user data for email
    const userResult = await query('SELECT name, email FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(user.email, user.name, {
        orderId: order.id,
        items: validatedItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice,
      });
    } catch (emailError) {
      console.error('Email sending failed but order was created:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT oi.*, p.name, p.description FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          ...order,
          items: itemsResult.rows,
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await query(
          `SELECT oi.*, p.name, p.description FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          ...order,
          items: itemsResult.rows,
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await query('SELECT * FROM orders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const order = result.rows[0];

    // Check ownership (user can only see their own orders)
    if (req.user.role !== 'admin' && order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Get order items
    const itemsResult = await query(
      `SELECT oi.*, p.name, p.description FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const result = await query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [
      status,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
