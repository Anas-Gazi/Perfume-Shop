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
      <div className="card product-card-luxury group cursor-pointer">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-[#f4efe6] sm:h-64">
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
                  ? 'border border-[#c9a84c]/35 bg-[#1e1a15]/75 text-[#f3dca0]'
                  : 'border border-white/20 bg-black/65 text-white/90'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="product-card-luxury__content">
          <h3 className="mb-1 text-sm font-bold text-luxury-dark line-clamp-2 sm:mb-2 sm:text-base">{product.name}</h3>

          {product.category && (
            <p className="mb-1 text-xs text-gray-600 capitalize sm:mb-2 sm:text-sm">{product.category}</p>
          )}

          {product.fragrance_type && (
            <p className="mb-2 text-[11px] text-gray-500 capitalize sm:mb-3 sm:text-xs">
              {product.fragrance_type} • {product.stock} in stock
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-bold text-luxury-gold sm:text-2xl">${product.price}</p>

            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-[#c9a84c]/30 bg-[#1f1a14] px-3 py-2 text-[11px] font-semibold tracking-wide text-[#f8f0dc] transition hover:bg-[#c9a84c] hover:text-[#1f1a14] sm:min-h-0 sm:w-auto sm:text-sm"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
