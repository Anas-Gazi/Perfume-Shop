// Root layout
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Perfume E-commerce | Luxury Fragrances',
  description:
    'Discover our exquisite collection of luxury perfumes. Premium fragrances for every occasion.',
  keywords: 'perfume, fragrance, luxury, cologne, scent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
