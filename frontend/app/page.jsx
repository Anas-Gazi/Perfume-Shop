// Home page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { getOptimizedImageUrl } from '@/lib/image';
import toast from 'react-hot-toast';

export default function Home() {
  const [homeSections, setHomeSections] = useState({
    bestSellers: [],
    newArrivals: [],
    onSale: [],
    fanFavorites: [],
  });
  const [loading, setLoading] = useState(true);

  const sectionConfig = [
    {
      key: 'bestSellers',
      title: 'Best Sellers',
    },
    {
      key: 'newArrivals',
      title: 'New Arrivals',
    },
    {
      key: 'onSale',
      title: 'On Sale',
    },
    {
      key: 'fanFavorites',
      title: 'Fan Favorites',
    },
  ];

  const trustSignals = [
    { label: 'Authentic Brands', value: '100%' },
    { label: 'Perfumes Curated', value: '500+' },
    { label: 'Average Dispatch', value: '24h' },
    { label: 'Happy Customers', value: '12k+' },
  ];

  const categoryCards = [
    {
      title: "Men's Perfumes",
      subtitle: 'Bold, woody and confident scents',
      href: '/men',
      image:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: "Women's Perfumes",
      subtitle: 'Elegant, floral and expressive notes',
      href: '/women',
      image:
        'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Unisex Perfumes',
      subtitle: 'Modern scents crafted for everyone',
      href: '/unisex',
      image:
        'https://images.unsplash.com/photo-1595425964071-8f2f0f4f6ce6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'All Products',
      subtitle: 'Browse the complete fragrance catalog',
      href: '/products',
      image:
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  useEffect(() => {
    const fetchHomeSections = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/home-sections');
        setHomeSections(response.data.data);
      } catch (error) {
        toast.error('Failed to load homepage collections');
        console.error('Error fetching homepage sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeSections();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-perfume relative isolate overflow-hidden px-4 py-20 text-white sm:py-24 md:px-8 md:py-28 lg:py-32">
        <div className="hero-perfume__vignette absolute inset-0"></div>
        <div className="hero-perfume__glow absolute -left-20 top-12 h-56 w-56 rounded-full blur-3xl sm:h-72 sm:w-72"></div>

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="hero-kicker mb-4 text-sm uppercase tracking-[0.36em] text-luxury-gold/90 sm:text-base">Signature Collection</p>

          <h1 className="hero-heading mb-6 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">The Art Of Scent, Bottled</h1>

          <p className="mx-auto mb-10 max-w-3xl text-base text-white/90 sm:text-lg md:text-xl">
            Immerse yourself in a curated world of rare and refined perfumes crafted for unforgettable first impressions.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link href="/products" className="btn-luxury inline-block min-w-48">
              Explore Collection
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex min-h-11 min-w-48 items-center justify-center rounded-lg border border-white/45 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-luxury-dark sm:text-base"
            >
              Book Fragrance Advice
            </Link>
          </div>
        </div>
      </section>

      <section className="marquee-strip" aria-label="Featured fragrance names">
        <div className="marquee-track">
          Midnight Oud &nbsp;·&nbsp; Rose Élégance &nbsp;·&nbsp; Ocean Mist &nbsp;·&nbsp; Amber Noir
          &nbsp;·&nbsp; Citrus Brise &nbsp;·&nbsp; Velvet Iris &nbsp;·&nbsp;Midnight Oud &nbsp;·&nbsp;
          Rose Élégance &nbsp;·&nbsp; Ocean Mist &nbsp;·&nbsp; Amber Noir &nbsp;·&nbsp; Citrus Brise
          &nbsp;·&nbsp; Velvet Iris &nbsp;·&nbsp;
        </div>
      </section>

      <section className="home-signal-strip">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 md:grid-cols-4 md:px-8">
          {trustSignals.map((signal) => (
            <div key={signal.label} className="home-signal-item">
              <p className="home-signal-item__value">{signal.value}</p>
              <p className="home-signal-item__label">{signal.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-luxury-gold/80">Shop By Category</p>
          <h2 className="section-title">Find Your Signature Scent</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categoryCards.map((card) => (
            <Link key={card.title} href={card.href} className="category-card group">
              <div className="category-card__image" aria-hidden="true">
                <Image
                  src={getOptimizedImageUrl(card.image, { width: 900, quality: 72 })}
                  alt={card.title}
                  fill
                  className="category-card__img-element"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="category-card__overlay"></div>
              <div className="category-card__content">
                <h3 className="category-card__title">{card.title}</h3>
                <p className="category-card__subtitle">{card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Collections */}
      <section className="home-collections-shell mx-auto max-w-7xl px-4 py-14 sm:py-16 md:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-luxury-dark"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {sectionConfig.map((section) => {
              const sectionProducts = homeSections?.[section.key] || [];

              if (sectionProducts.length === 0) {
                return null;
              }

              return (
                <div key={section.key} className="collection-block">
                  <div className="mb-6 flex flex-col items-center justify-center gap-2 text-center">
                    <h3 className="text-2xl font-bold text-luxury-dark sm:text-3xl">{section.title}</h3>
                  </div>

                  <div className="section-scroll-row" aria-label={`${section.title} products`}>
                    {sectionProducts.map((product) => (
                      <div key={`${section.key}-${product.id}`} className="section-scroll-row__item">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading &&
          sectionConfig.every((section) => (homeSections?.[section.key] || []).length === 0) && (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-500">No curated products available yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Admin can tag products as Best Seller, New Arrival, On Sale, or Fan Favorite.
            </p>
          </div>
          )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.24em] text-luxury-gold/80">Customer Promise</p>
          <h2 className="section-title mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {[
              {
                title: 'Premium Quality',
                description: 'Authentic fragrances from world-renowned brands',
                icon: '01',
              },
              {
                title: 'Fast Shipping',
                description: 'Free shipping on orders over $50',
                icon: '02',
              },
              {
                title: '100% Satisfaction',
                description: '30-day money-back guarantee',
                icon: '03',
              },
            ].map((item, index) => (
              <div key={index} className="card border border-luxury-gold/20 text-center">
                <p className="mb-3 text-xs font-bold tracking-[0.28em] text-luxury-gold/70">{item.icon}</p>
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
