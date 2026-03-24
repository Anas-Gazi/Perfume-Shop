// Product controller
const { query } = require('../config/database');
const { validate, productSchema } = require('../utils/validation');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

// Get all products with optional filters
const getAllProducts = async (req, res, next) => {
  try {
    const { category, fragranceType, minPrice, maxPrice, search } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      sql += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (fragranceType) {
      paramCount++;
      sql += ` AND fragrance_type = $${paramCount}`;
      params.push(fragranceType);
    }

    if (minPrice) {
      paramCount++;
      sql += ` AND price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      sql += ` AND price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      paramCount++;
      sql += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    // Fetch images for each product
    const productsWithImages = await Promise.all(
      result.rows.map(async (product) => {
        const imagesResult = await query('SELECT image_url FROM product_images WHERE product_id = $1', [
          product.id,
        ]);
        return {
          ...product,
          images: imagesResult.rows.map((img) => img.image_url),
        };
      })
    );

    res.json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = result.rows[0];

    // Get images
    const imagesResult = await query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);

    res.json({
      success: true,
      data: {
        ...product,
        images: imagesResult.rows.map((img) => img.image_url),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create product (admin only)
const createProduct = async (req, res, next) => {
  try {
    const validatedData = validate(productSchema, req.body);

    // Insert product
    const result = await query(
      'INSERT INTO products (name, price, description, category, fragrance_type, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        validatedData.name,
        validatedData.price,
        validatedData.description,
        validatedData.category,
        validatedData.fragranceType,
        validatedData.stock,
      ]
    );

    const product = result.rows[0];
    const images = [];

    // Upload images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.path);
        await query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [
          product.id,
          imageUrl,
        ]);
        images.push(imageUrl);

        // Delete temporary file
        fs.unlinkSync(file.path);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product,
        images,
      },
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// Update product (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = validate(productSchema, req.body);

    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update product
    const updatedResult = await query(
      'UPDATE products SET name = $1, price = $2, description = $3, category = $4, fragrance_type = $5, stock = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [
        validatedData.name,
        validatedData.price,
        validatedData.description,
        validatedData.category,
        validatedData.fragranceType,
        validatedData.stock,
        id,
      ]
    );

    const product = updatedResult.rows[0];

    // Handle new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.path);
        await query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [id, imageUrl]);
        fs.unlinkSync(file.path);
      }
    }

    // Get all images
    const imagesResult = await query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...product,
        images: imagesResult.rows.map((img) => img.image_url),
      },
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(error);
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get and delete images
    const imagesResult = await query('SELECT image_url FROM product_images WHERE product_id = $1', [id]);
    for (const img of imagesResult.rows) {
      await deleteFromCloudinary(img.image_url);
    }

    // Delete product and related records (cascade should handle this)
    await query('DELETE FROM products WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
