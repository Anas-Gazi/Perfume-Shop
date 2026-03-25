// Header component with navigation
'use client';

import { useEffect, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-luxury-gold sm:text-2xl">
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
          <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
            {/* Cart */}
            <Link href="/cart" className="relative rounded-md p-1.5 hover:bg-gray-100" aria-label="Open cart">
              <span className="text-xl sm:text-2xl">🛍️</span>
              {cartItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-luxury-dark">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden items-center gap-4 md:flex">
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
              <div className="hidden gap-3 md:flex">
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-xl text-luxury-dark hover:bg-gray-50 md:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="space-y-3 border-t border-gray-200 pb-4 pt-3 md:hidden">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100 hover:text-luxury-gold">
              Home
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100 hover:text-luxury-gold">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100 hover:text-luxury-gold">
                Admin
              </Link>
            )}

            {user ? (
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600">Signed in as <span className="font-semibold text-luxury-dark">{user.name}</span></p>
                <button
                  onClick={handleLogout}
                  className="btn-luxury w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-luxury-outline w-full">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-luxury w-full">
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
