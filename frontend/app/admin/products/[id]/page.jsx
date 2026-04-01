// Admin product create/edit page
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    fragranceType: '',
    stock: '',
  });

  const isEdit = params?.id && params.id !== 'create';

  const fetchProduct = useCallback(async () => {
    try {
      const response = await api.get(`/products/${params.id}`);
      const product = response.data.data;
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        category: product.category || '',
        fragranceType: product.fragrance_type || '',
        stock: product.stock,
      });
      // Don't set images as they're already on Cloudinary
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error:', error);
    }
  }, [params?.id]);

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (isEdit) {
      fetchProduct();
    }
  }, [user, router, isEdit, hasInitialized, fetchProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('fragranceType', formData.fragranceType);
      data.append('stock', formData.stock);

      // Add images
      images.forEach((image) => {
        data.append('images', image);
      });

      if (isEdit) {
        await api.put(`/products/${params.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created successfully');
      }

      router.push('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-8">
      <Link href="/admin/products" className="mb-8 inline-block text-luxury-gold hover:underline">
        ← Back to Products
      </Link>

      <h1 className="section-title mb-8">{isEdit ? 'Edit Product' : 'Create New Product'}</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Product Name */}
        <div>
          <label className="mb-2 block font-semibold">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
            placeholder="Luxury Perfume"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block font-semibold">Price (USD) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
            placeholder="99.99"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
            placeholder="Describe your product..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-semibold">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Fragrance Type */}
        <div>
          <label className="mb-2 block font-semibold">Fragrance Type *</label>
          <select
            name="fragranceType"
            value={formData.fragranceType}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
          >
            <option value="">Select Type</option>
            <option value="woody">Woody</option>
            <option value="floral">Floral</option>
            <option value="citrus">Citrus</option>
            <option value="oriental">Oriental</option>
            <option value="fresh">Fresh</option>
            <option value="fruity">Fruity</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="mb-2 block font-semibold">Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
            placeholder="0"
          />
        </div>

        {/* Images */}
        <div>
          <label className="mb-2 block font-semibold">Product Images (Up to 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {images.length > 0 && (
            <p className="mt-2 text-sm text-green-600">{images.length} image(s) selected</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-luxury flex-1 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="btn-luxury-outline flex-1 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
