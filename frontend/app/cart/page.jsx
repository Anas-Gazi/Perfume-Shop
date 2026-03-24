// Cart page
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import { useAuthStore } from '@/lib/authStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const user = useAuthStore((state) => state.user);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <h1 className="section-title mb-8">Shopping Cart</h1>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="mb-6 text-2xl text-gray-500">Your cart is empty</p>
          <Link href="/products" className="btn-luxury inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="section-title mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="card flex gap-4">
                {/* Image */}
                {item.images && item.images.length > 0 ? (
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 flex-shrink-0 rounded bg-gray-200" />
                )}

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-luxury-dark">{item.name}</h3>
                    <p className="text-luxury-gold">${item.price}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex flex-col items-end justify-center">
                  <p className="text-lg font-bold text-luxury-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-4">
            <h2 className="subsection-title">Order Summary</h2>

            <div className="space-y-2 border-y border-gray-200 py-4">
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
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-luxury-gold">
                ${(total + (total > 50 ? 0 : 10) + total * 0.1).toFixed(2)}
              </span>
            </div>

            {user ? (
              <Link href="/checkout" className="btn-luxury mx-auto block w-auto px-4 py-2 text-center text-sm">
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Please sign in to continue checkout
                </p>
                <Link href="/login" className="btn-luxury block text-center">
                  Sign In
                </Link>
              </div>
            )}

            <Link href="/products" className="btn-luxury-outline mx-auto block w-auto px-4 py-2 text-center text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
