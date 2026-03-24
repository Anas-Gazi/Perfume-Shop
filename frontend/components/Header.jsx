// Header component with navigation
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useCartStore } from '@/lib/cartStore';

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-luxury-gold">
            Perfume
          </Link>

          {/* Navigation */}
          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="hover:text-luxury-gold">Home</Link>
            <Link href="/products" className="hover:text-luxury-gold">Products</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-luxury-gold">
                Admin
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <span className="text-2xl">🛍️</span>
              {cartItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-luxury-dark">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded bg-luxury-dark px-4 py-2 text-sm text-white hover:bg-luxury-gold hover:text-luxury-dark"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="rounded border-2 border-luxury-dark px-4 py-2 text-sm hover:bg-luxury-dark hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-luxury text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex gap-4 pb-4 md:hidden">
          <Link href="/" className="text-sm hover:text-luxury-gold">
            Home
          </Link>
          <Link href="/products" className="text-sm hover:text-luxury-gold">
            Products
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm hover:text-luxury-gold">
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
