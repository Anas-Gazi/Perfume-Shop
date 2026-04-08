// Products listing page
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { useProductStore } from '@/lib/productStore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { filters } = useProductStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          ...(filters.category && { category: filters.category }),
          ...(filters.fragranceType && { fragranceType: filters.fragranceType }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.search && { search: filters.search }),
        };

        const response = await api.get('/products', { params });
        setProducts(response.data.data);
      } catch (error) {
        toast.error('Failed to load products');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-8">
        <h1 className="section-title mb-4">Our Collection</h1>
        <p className="text-xl text-gray-600">Discover our exquisite range of luxury fragrances</p>
      </div>

      <button
        type="button"
        onClick={() => setShowFilters((prev) => !prev)}
        className="mb-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-luxury-dark hover:bg-gray-50 md:hidden"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:col-span-1 md:block`}>
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-xl text-gray-500">No products found matching your criteria</p>
            </div>
          )}
          <div className="mt-8 text-center text-sm text-gray-500">
            {products.length > 0 && `Showing ${products.length} result(s)`}
          </div>
        </div>
      </div>
    </div>
  );
}
