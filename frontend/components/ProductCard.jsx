// Product card component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card group cursor-pointer">
        {/* Image */}
        <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute right-4 top-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                product.stock > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Details */}
        <h3 className="mb-2 font-bold text-luxury-dark line-clamp-2">{product.name}</h3>

        {product.category && (
          <p className="mb-2 text-sm text-gray-600 capitalize">{product.category}</p>
        )}

        {product.fragrance_type && (
          <p className="mb-3 text-xs text-gray-500 capitalize">
            {product.fragrance_type} • {product.stock} in stock
          </p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-luxury-gold">${product.price}</p>

          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="rounded bg-luxury-dark px-3 py-2 text-sm text-white hover:bg-luxury-gold hover:text-luxury-dark"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
