// Admin products management page
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProducts();
  }, [user, router, hasInitialized]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="section-title">Manage Products</h1>
        <Link href="/admin/products/create" className="btn-luxury">
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200" />
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">${product.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">No products yet</p>
          <Link href="/admin/products/create" className="btn-luxury mt-4 inline-block">
            Create First Product
          </Link>
        </div>
      )}
    </div>
  );
}
