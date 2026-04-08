// Footer component
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
              <li><a href="/help-center" className="hover:text-luxury-gold">Help Center</a></li>
              <li><a href="/contact-us" className="hover:text-luxury-gold">Contact Us</a></li>
              <li><a href="/returns" className="hover:text-luxury-gold">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-luxury-gold">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-luxury-gold">Terms & Conditions</a></li>
              <li><a href="/shipping" className="hover:text-luxury-gold">Shipping</a></li>
            </ul>

            {(socialLinks.facebook || socialLinks.instagram || socialLinks.whatsapp) && (
              <>
                <h4 className="mb-3 mt-6 font-semibold">Social</h4>
                <ul className="space-y-2 text-sm">
                  {socialLinks.facebook && (
                    <li>
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-luxury-gold"
                      >
                        <FacebookIcon />
                        Facebook
                      </a>
                    </li>
                  )}
                  {socialLinks.instagram && (
                    <li>
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-luxury-gold"
                      >
                        <InstagramIcon />
                        Instagram
                      </a>
                    </li>
                  )}
                  {socialLinks.whatsapp && (
                    <li>
                      <a
                        href={socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-luxury-gold"
                      >
                        <WhatsAppIcon />
                        WhatsApp
                      </a>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Perfume E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
