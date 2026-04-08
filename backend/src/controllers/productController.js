// Product controller
const { query } = require('../config/database');
const { validate, productSchema } = require('../utils/validation');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

const withImages = async (products = []) => {
  if (!products.length) {
    return [];
  }

  const productIds = products.map((product) => product.id);
  const imagesResult = await query(
    'SELECT product_id, image_url FROM product_images WHERE product_id = ANY($1)',
    [productIds]
  );

  const imagesByProductId = new Map();
  for (const row of imagesResult.rows) {
    const key = String(row.product_id);
    const existing = imagesByProductId.get(key) || [];
    existing.push(row.image_url);
    imagesByProductId.set(key, existing);
  }

  return products.map((product) => ({
    ...product,
    images: imagesByProductId.get(String(product.id)) || [],
  }));
};

const applyAudienceFilter = ({ audience, params, paramCountRef }) => {
  if (!audience) {
    return '';
  }

  const normalized = String(audience).trim().toLowerCase();
  if (!['men', 'women'].includes(normalized)) {
    return '';
  }

  paramCountRef.count++;
  params.push(normalized === 'men' ? 'Men' : 'Women');
  return ` AND (category = $${paramCountRef.count} OR category = 'Unisex')`;
};

// Get all products with optional filters
const getAllProducts = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const { category, fragranceType, minPrice, maxPrice, search, audience } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    const paramCountRef = { count: 0 };

    if (category) {
      paramCountRef.count++;
      sql += ` AND category = $${paramCountRef.count}`;
      params.push(category);
    }

    if (fragranceType) {
      paramCountRef.count++;
      sql += ` AND fragrance_type = $${paramCountRef.count}`;
      params.push(fragranceType);
    }

    if (minPrice) {
      paramCountRef.count++;
      sql += ` AND price >= $${paramCountRef.count}`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCountRef.count++;
      sql += ` AND price <= $${paramCountRef.count}`;
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      paramCountRef.count++;
      sql += ` AND (name ILIKE $${paramCountRef.count} OR description ILIKE $${paramCountRef.count})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    sql += applyAudienceFilter({ audience, params, paramCountRef });

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    const productsWithImages = await withImages(result.rows);

    res.json({
      success: true,
      data: productsWithImages,
    });
  } catch (error) {
    next(error);
  }
};

const getHomeSections = async (req, res, next) => {
  try {
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    const { audience } = req.query;
    const params = [];
    const paramCountRef = { count: 0 };
    const audienceClause = applyAudienceFilter({ audience, params, paramCountRef });

    const sectionQueries = {
      bestSellers: `SELECT * FROM products WHERE is_best_seller = TRUE${audienceClause} ORDER BY updated_at DESC LIMIT 8`,
      newArrivals: `SELECT * FROM products WHERE is_new_arrival = TRUE${audienceClause} ORDER BY created_at DESC LIMIT 8`,
      onSale: `SELECT * FROM products WHERE is_on_sale = TRUE${audienceClause} ORDER BY updated_at DESC LIMIT 8`,
      fanFavorites: `SELECT * FROM products WHERE is_fan_favorite = TRUE${audienceClause} ORDER BY updated_at DESC LIMIT 8`,
    };

    const [bestSellersResult, newArrivalsResult, onSaleResult, fanFavoritesResult] = await Promise.all([
      query(sectionQueries.bestSellers, params),
      query(sectionQueries.newArrivals, params),
      query(sectionQueries.onSale, params),
      query(sectionQueries.fanFavorites, params),
    ]);

    const [bestSellers, newArrivals, onSale, fanFavorites] = await Promise.all([
      withImages(bestSellersResult.rows),
      withImages(newArrivalsResult.rows),
      withImages(onSaleResult.rows),
      withImages(fanFavoritesResult.rows),
    ]);

    res.json({
      success: true,
      data: {
        bestSellers,
        newArrivals,
        onSale,
        fanFavorites,
      },
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
      'INSERT INTO products (name, price, description, category, fragrance_type, stock, is_best_seller, is_new_arrival, is_on_sale, is_fan_favorite) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        validatedData.name,
        validatedData.price,
        validatedData.description,
        validatedData.category,
        validatedData.fragranceType,
        validatedData.stock,
        validatedData.isBestSeller,
        validatedData.isNewArrival,
        validatedData.isOnSale,
        validatedData.isFanFavorite,
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
      'UPDATE products SET name = $1, price = $2, description = $3, category = $4, fragrance_type = $5, stock = $6, is_best_seller = $7, is_new_arrival = $8, is_on_sale = $9, is_fan_favorite = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
      [
        validatedData.name,
        validatedData.price,
        validatedData.description,
        validatedData.category,
        validatedData.fragranceType,
        validatedData.stock,
        validatedData.isBestSeller,
        validatedData.isNewArrival,
        validatedData.isOnSale,
        validatedData.isFanFavorite,
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
  getHomeSections,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
