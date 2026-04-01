// Footer component
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-luxury-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-luxury-gold">Perfume</h3>
            <p className="text-sm text-gray-300">
              Discover the world&apos;s most exquisite fragrances handpicked for luxury and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-luxury-gold">Home</a></li>
              <li><a href="/products" className="hover:text-luxury-gold">Products</a></li>
              <li><a href="/cart" className="hover:text-luxury-gold">Cart</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-luxury-gold">Help Center</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Contact Us</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-luxury-gold">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-luxury-gold">Shipping</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Perfume E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
