// Admin orders management page
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => Number(value || 0).toFixed(2);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [user, router, hasInitialized]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="section-title mb-8">All Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="subsection-title">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">
                  {order.user_name} ({order.user_email})
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-luxury-gold">${formatCurrency(order.total_price)}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="mt-2 rounded border border-gray-300 px-3 py-1 capitalize"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="space-y-1 text-sm">
                {(order.items || []).map((item) => (
                  <li key={item.id}>
                    {item.name} x{item.quantity} - ${formatCurrency(item.price)}
                  </li>
                ))}
              </ul>
            </div>

            {order.shipping_address && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                <p className="text-sm text-gray-600">{order.shipping_address}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">No orders yet</p>
        </div>
      )}
    </div>
  );
}
