export default function ShippingPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Shipping</h1>
      <p className="mt-4 text-gray-700">
        We ship nationwide with reliable partners and tracking support.
      </p>

      <section className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
        <p>Standard shipping: 3-7 business days.</p>
        <p>Express shipping: 1-3 business days where available.</p>
        <p>Tracking details are sent after your order is dispatched.</p>
        <p>Delivery timelines may vary during holidays and peak periods.</p>
      </section>
    </main>
  );
}
