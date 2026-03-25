// Zod validation schemas
const { z } = require('zod');

// Auth validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer_not_to_say']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Product validation schemas
const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  price: z.coerce.number().positive('Price must be positive'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  fragranceType: z
    .string()
    .min(1, 'Fragrance type is required')
    .refine(
      (val) => ['woody', 'floral', 'citrus', 'oriental', 'fresh', 'fruity'].includes(val),
      'Invalid fragrance type'
    ),
  stock: z.coerce.number().int().nonnegative('Stock must be non-negative'),
});

// Order validation schemas
const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().positive(),
        quantity: z.number().positive(),
      })
    )
    .min(1, 'Order must contain at least one item'),
  shippingAddress: z.string().min(5, 'Valid shipping address is required'),
});

// Validate function helper
const validate = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw {
      status: 400,
      message: 'Validation error',
      errors: error.errors,
    };
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  placeOrderSchema,
  validate,
};
