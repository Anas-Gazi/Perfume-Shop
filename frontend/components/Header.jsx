// Header component with navigation
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useCartStore } from '@/lib/cartStore';
import { socialLinks } from '@/lib/socialLinks';

const iconClass = 'h-4 w-4';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClass}>
    <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.85 3.44 8.9 8 9.79v-6.93H7.9v-2.86H10V9.85c0-2.08 1.24-3.23 3.14-3.23.91 0 1.86.16 1.86.16v2.05h-1.05c-1.03 0-1.35.64-1.35 1.3v1.94h2.3l-.37 2.86h-1.93V21.86c4.56-.89 8-4.94 8-9.79z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClass}>
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm9.1 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClass}>
    <path d="M12 2a9.9 9.9 0 0 0-8.57 14.86L2 22l5.28-1.38A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.13-1.46-.72-1.69-.8-.23-.08-.4-.13-.57.13-.17.25-.65.8-.8.97-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.2-.49-.4-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.6.13.17 1.77 2.71 4.29 3.8.6.26 1.07.42 1.43.54.6.19 1.15.16 1.59.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
  </svg>
);

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);
  const cartItems = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Desktop-only dropdown state for social icon reveal.
  const [socialMenuOpen, setSocialMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Keep mobile drawer state consistent when auth state changes (login/logout).
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
          <div className="hidden items-center gap-5 md:flex lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="text-sm font-medium transition hover:text-luxury-gold">Home</Link>
              <Link href="/products" className="text-sm font-medium transition hover:text-luxury-gold">Products</Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium transition hover:text-luxury-gold">
                  Admin
                </Link>
              )}
            </nav>

            {(socialLinks.facebook || socialLinks.instagram || socialLinks.whatsapp) && (
              <div
                className="relative"
                // Hover supports pointer users; click supports keyboard/touchpad interactions.
                onMouseEnter={() => setSocialMenuOpen(true)}
                onMouseLeave={() => setSocialMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setSocialMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm transition hover:border-luxury-gold hover:text-luxury-gold"
                  aria-haspopup="true"
                  aria-expanded={socialMenuOpen}
                >
                  Social Media
                  <span className={`text-xs transition-transform ${socialMenuOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <div
                  className={`absolute right-0 top-[calc(100%+8px)] flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg transition-all duration-200 ${
                    socialMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                  }`}
                >
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Facebook"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-50 hover:text-[#1877F2]"
                    >
                      <FacebookIcon />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Instagram"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-50 hover:text-[#E1306C]"
                    >
                      <InstagramIcon />
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open WhatsApp chat"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-50 hover:text-[#25D366]"
                    >
                      <WhatsAppIcon />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

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

            {(socialLinks.facebook || socialLinks.instagram || socialLinks.whatsapp) && (
              // Mobile keeps icons directly visible to avoid nested dropdown complexity.
              <div className="flex items-center gap-2 border-t border-gray-200 pt-3">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Facebook"
                    className="rounded-md border border-gray-300 p-2 text-gray-700 transition hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Instagram"
                    className="rounded-md border border-gray-300 p-2 text-gray-700 transition hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {socialLinks.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open WhatsApp chat"
                    className="rounded-md border border-gray-300 p-2 text-gray-700 transition hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    <WhatsAppIcon />
                  </a>
                )}
              </div>
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
