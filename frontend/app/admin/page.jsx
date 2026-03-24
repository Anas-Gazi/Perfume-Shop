// Admin dashboard page
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/users/stats');
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load statistics');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router, hasInitialized]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-8">
        <h1 className="section-title mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-4xl font-bold text-luxury-gold">{stats.totalUsers}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-4xl font-bold text-luxury-gold">{stats.totalOrders}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-4xl font-bold text-luxury-gold">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Average Order</p>
            <p className="text-4xl font-bold text-luxury-gold">
              ${(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Management Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin/products" className="card hover:shadow-lg">
          <div className="mb-4 text-4xl">📦</div>
          <h3 className="subsection-title mb-2">Products</h3>
          <p className="mb-4 text-gray-600">Add, edit, or delete products</p>
          <span className="text-luxury-gold font-semibold">Manage →</span>
        </Link>

        <Link href="/admin/orders" className="card hover:shadow-lg">
          <div className="mb-4 text-4xl">🛒</div>
          <h3 className="subsection-title mb-2">Orders</h3>
          <p className="mb-4 text-gray-600">View and manage customer orders</p>
          <span className="text-luxury-gold font-semibold">Manage →</span>
        </Link>

        <Link href="/admin/users" className="card hover:shadow-lg">
          <div className="mb-4 text-4xl">👥</div>
          <h3 className="subsection-title mb-2">Users</h3>
          <p className="mb-4 text-gray-600">View all registered users</p>
          <span className="text-luxury-gold font-semibold">Manage →</span>
        </Link>
      </div>
    </div>
  );
}
