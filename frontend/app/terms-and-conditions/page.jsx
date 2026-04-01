export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Terms & Conditions</h1>
      <p className="mt-4 text-gray-700">
        By using this website, you agree to the following terms.
      </p>

      <section className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
        <p>All orders are subject to product availability and confirmation.</p>
        <p>Prices may change without notice, but confirmed orders keep their purchase price.</p>
        <p>Users are responsible for keeping account credentials secure.</p>
        <p>We reserve the right to cancel fraudulent or abusive transactions.</p>
      </section>
    </main>
  );
}
