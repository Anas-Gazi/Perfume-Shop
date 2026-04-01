export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Privacy Policy</h1>
      <p className="mt-4 text-gray-700">
        We collect only the information needed to process orders and improve your experience.
      </p>

      <section className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
        <p>We store account and order information securely.</p>
        <p>We do not sell your personal data to third parties.</p>
        <p>Payment details are handled by secure providers and are not stored in plain text.</p>
        <p>You can request data updates or deletion by contacting support.</p>
      </section>
    </main>
  );
}
