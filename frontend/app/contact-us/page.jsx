export default function ContactUsPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Contact Us</h1>
      <p className="mt-4 text-gray-700">
        We are here to help with product questions, order updates, and account support.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-luxury-dark">Customer Support</h2>
          <p className="mt-2 text-gray-700">Email: support@perfume-shop.com</p>
          <p className="text-gray-700">Phone: +1 (555) 014-7788</p>
          <p className="mt-2 text-sm text-gray-500">Mon-Fri, 9:00 AM - 6:00 PM</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-luxury-dark">Business Address</h2>
          <p className="mt-2 text-gray-700">Perfume E-Commerce</p>
          <p className="text-gray-700">125 Fragrance Avenue</p>
          <p className="text-gray-700">New York, NY 10001, USA</p>
        </div>
      </section>
    </main>
  );
}
