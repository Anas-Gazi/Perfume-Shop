export default function ReturnsPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Returns</h1>
      <p className="mt-4 text-gray-700">
        We accept returns for eligible items within 14 days of delivery.
      </p>

      <section className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
        <p>Returned products must be sealed, unused, and in original packaging.</p>
        <p>Customized or final-sale products are not eligible for returns.</p>
        <p>Refunds are issued to the original payment method after inspection.</p>
        <p>Shipping charges are non-refundable unless the item is incorrect or defective.</p>
      </section>
    </main>
  );
}
