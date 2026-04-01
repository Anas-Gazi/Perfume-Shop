export default function HelpCenterPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-bold text-luxury-dark">Help Center</h1>
      <p className="mt-4 text-gray-700">
        Find quick answers about orders, accounts, payments, and delivery.
      </p>

      <section className="mt-8 space-y-6">
        <article className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-luxury-dark">Order Questions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Track your order in your account order history.</li>
            <li>Order status updates include pending, shipped, delivered, and cancelled.</li>
            <li>If your order is delayed, contact support with your order ID.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-luxury-dark">Account & Login</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Use your registered email for login.</li>
            <li>Make sure your browser allows local storage for session tokens.</li>
            <li>If login fails, clear browser cache and try again.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-luxury-dark">Need more help?</h2>
          <p className="mt-3 text-gray-700">
            Visit the Contact Us page to reach our support team.
          </p>
        </article>
      </section>
    </main>
  );
}
