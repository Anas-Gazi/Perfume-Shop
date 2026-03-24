// Order confirmation page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function OrderPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${params.id}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to load order');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 text-center">
        <p className="mb-4 text-2xl">Order not found</p>
        <Link href="/" className="btn-luxury inline-block">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="card text-center">
        <div className="mb-4 text-6xl">✓</div>
        <h1 className="section-title mb-4">Order Confirmed!</h1>
        <p className="mb-6 text-xl text-gray-600">Thank you for your purchase</p>

        <div className="mb-8 rounded-lg bg-luxury-cream p-6">
          <div className="mb-4">
            <p className="font-semibold text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-luxury-dark">#{order.id}</p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-gray-600">Order Date</p>
            <p className="text-lg text-luxury-dark">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>

          <div className="border-y border-gray-300 py-4">
            <h3 className="subsection-title mb-4">Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity}x ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-luxury-gold">${order.total_price.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 rounded bg-blue-50 p-4">
            <p className="font-semibold text-blue-800">Status: {order.status.toUpperCase()}</p>
            <p className="text-sm text-blue-600 mt-2">
              We'll send you an email with tracking information once your order ships.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/products" className="btn-luxury-outline">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-luxury">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
