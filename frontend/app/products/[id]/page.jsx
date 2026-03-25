// Product details page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetailsPage({ params }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data.data);
      } catch (error) {
        toast.error('Failed to load product');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="mb-4 text-2xl">Product not found</p>
        <Link href="/products" className="btn-luxury inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <Link href="/products" className="mb-8 inline-block text-luxury-gold hover:underline">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Images */}
        <div>
          {product.images && product.images.length > 0 ? (
            <div className="relative h-72 w-full overflow-hidden rounded-lg bg-white shadow-md sm:h-96 md:h-[500px]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-lg bg-gray-200 sm:h-96 md:h-[500px]">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, index) => (
                <div key={index} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded sm:h-24 sm:w-24">
                  <Image
                    src={img}
                    alt={`${product.name}-${index}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="section-title mb-4">{product.name}</h1>

          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-3xl font-bold text-luxury-gold sm:text-4xl">${product.price}</span>
            <span
              className={`rounded-full px-4 py-2 font-semibold ${
                product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="subsection-title mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.category && (
              <div>
                <h4 className="font-semibold text-luxury-dark">Category</h4>
                <p className="text-gray-600">{product.category}</p>
              </div>
            )}
            {product.fragrance_type && (
              <div>
                <h4 className="font-semibold text-luxury-dark">Fragrance Type</h4>
                <p className="text-gray-600 capitalize">{product.fragrance_type}</p>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <label htmlFor="quantity" className="font-semibold">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="min-h-11 w-24 rounded border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-luxury w-full disabled:opacity-50"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
