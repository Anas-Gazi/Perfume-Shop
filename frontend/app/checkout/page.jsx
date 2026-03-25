// Checkout page
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';
import { checkoutSchema } from '@/lib/validation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  if (!hasInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 text-center">
        <p className="mb-4 text-2xl">Please sign in to complete your purchase</p>
        <Link href="/login" className="btn-luxury inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 text-center">
        <p className="mb-4 text-2xl">Your cart is empty</p>
        <Link href="/products" className="btn-luxury inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: data.shippingAddress,
      };

      // Place order
      const response = await api.post('/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();

      // Redirect to order confirmation
      router.push(`/orders/${response.data.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Address */}
            <div className="card">
              <h2 className="subsection-title mb-4">Shipping Address</h2>
              <textarea
                {...register('shippingAddress')}
                placeholder="Enter your complete shipping address"
                rows="4"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
              />
              {errors.shippingAddress && (
                <span className="text-sm text-red-500">{errors.shippingAddress.message}</span>
              )}
            </div>

            {/* Payment Information */}
            <div className="card">
              <h2 className="subsection-title mb-4">Payment Information</h2>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="mb-2 block font-semibold">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    {...register('cardNumber')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
                  />
                  {errors.cardNumber && (
                    <span className="text-sm text-red-500">{errors.cardNumber.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label className="mb-2 block font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      {...register('expiryDate')}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
                    />
                    {errors.expiryDate && (
                      <span className="text-sm text-red-500">{errors.expiryDate.message}</span>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="mb-2 block font-semibold">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="4"
                      {...register('cvv')}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
                    />
                    {errors.cvv && (
                      <span className="text-sm text-red-500">{errors.cvv.message}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="subsection-title mb-4">Order Summary</h2>

            <div className="mb-4 space-y-2 border-b border-gray-200 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{total > 50 ? 'Free' : '$10.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-luxury-gold">
                    ${(total + (total > 50 ? 0 : 10) + total * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
