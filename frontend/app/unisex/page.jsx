// Unisex perfumes page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function UnisexPerfumesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products', {
          params: { category: 'Unisex' },
        });
        setProducts(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load unisex perfumes");
        console.error('Error loading unisex products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="audience-hero audience-hero--split audience-hero-unisex px-4 py-14 text-white sm:py-16 md:px-8">
        <div className="audience-hero__grid mx-auto max-w-7xl">
          <div className="audience-hero__copy">
            <p className="audience-hero__kicker">Universal Collection</p>
            <h1 className="hero-heading audience-hero__title">Unisex Perfumes</h1>
            <p className="audience-hero__desc">
              Discover balanced and versatile fragrances designed for every personality.
            </p>
            <div className="audience-hero__actions mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-luxury">All Perfumes</Link>
              <Link href="/men" className="btn-luxury-outline border-white/60 text-white hover:bg-white hover:text-luxury-dark">Men's Perfumes</Link>
              <Link href="/women" className="btn-luxury-outline border-white/60 text-white hover:bg-white hover:text-luxury-dark">Women's Perfumes</Link>
            </div>
          </div>

          <div className="audience-hero__visual audience-hero__visual-unisex">
            <span className="audience-hero__badge">Shared Signature</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-luxury-gold/20 bg-white/80 px-6 py-14 text-center">
            <p className="text-xl font-semibold text-luxury-dark">No unisex perfumes available right now</p>
            <p className="mt-2 text-gray-600">Add unisex products from admin to populate this collection.</p>
          </div>
        )}
      </section>
    </div>
  );
}
