// Product filters component
'use client';

import { useState } from 'react';
import { useProductStore } from '@/lib/productStore';

export default function ProductFilters() {
  const { filters, setFilters, resetFilters } = useProductStore();
  const [search, setSearch] = useState(filters.search);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilters({ search: value });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters({ maxPrice: value });
  };

  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value });
  };

  const handleFragranceChange = (e) => {
    setFilters({ fragranceType: e.target.value });
  };

  return (
    <div className="card space-y-6">
      <h2 className="subsection-title">Filters</h2>

      {/* Search */}
      <div>
        <label className="mb-2 block font-semibold">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block font-semibold">Category</label>
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Fragrance Type */}
      <div>
        <label className="mb-2 block font-semibold">Fragrance Type</label>
        <select
          value={filters.fragranceType}
          onChange={handleFragranceChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="woody">Woody</option>
          <option value="floral">Floral</option>
          <option value="citrus">Citrus</option>
          <option value="oriental">Oriental</option>
          <option value="fresh">Fresh</option>
          <option value="fruity">Fruity</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block font-semibold">
          Max Price: ${filters.maxPrice}
        </label>
        <input
          type="range"
          min="0"
          max="10000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-luxury-gold"
        />
        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>$0</span>
          <span>$10,000</span>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="btn-luxury-outline w-full"
      >
        Reset Filters
      </button>
    </div>
  );
}
