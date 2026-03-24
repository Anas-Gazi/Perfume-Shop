// Home page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useProductStore } from '@/lib/productStore';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setProducts: storeProducts } = useProductStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data.data);
        storeProducts(response.data.data);
      } catch (error) {
        toast.error('Failed to load products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-luxury-dark to-luxury-rose px-4 py-24 text-white md:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold">Luxurious Fragrances</h1>
          <p className="mb-8 text-xl">Discover the essence of elegance and sophistication</p>
          <Link href="/products" className="btn-luxury inline-block">
            Explore Collections
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="section-title mb-12 text-center">Featured Perfumes</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-500">No products available yet</p>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="section-title mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Premium Quality',
                description: 'Authentic fragrances from world-renowned brands',
              },
              {
                title: 'Fast Shipping',
                description: 'Free shipping on orders over $50',
              },
              {
                title: '100% Satisfaction',
                description: '30-day money-back guarantee',
              },
            ].map((item, index) => (
              <div key={index} className="card text-center">
                <h3 className="subsection-title mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
