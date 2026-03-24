// Zod validation schemas for frontend
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, 'Valid shipping address is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Invalid expiry date'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

export const productReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});
