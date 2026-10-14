import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Terms &amp; Conditions</h1>
      <p className="text-gray-500 text-sm mb-6">Last updated: <strong>[OWNER TO INSERT DATE]</strong></p>
      <div className="space-y-4 text-sm text-gray-600">
        <p>By placing an order on B2C Bazar, you agree to these terms.</p>
        <h2 className="text-base font-semibold text-gray-800">Orders</h2>
        <p>All orders are subject to product availability. We reserve the right to cancel orders if stock is unavailable after placement.</p>
        <h2 className="text-base font-semibold text-gray-800">Payment</h2>
        <p>We accept Cash on Delivery (COD) only. Payment is collected upon delivery.</p>
        <h2 className="text-base font-semibold text-gray-800">Delivery</h2>
        <p>Delivery is handled by Pathao Courier. Delivery times are estimates and not guaranteed.</p>
        <h2 className="text-base font-semibold text-gray-800">Governing Law</h2>
        <p>These terms are governed by the laws of Bangladesh.</p>
      </div>
      <p className="text-xs text-gray-400 mt-8 border-t pt-4">
        <strong>Note to owner:</strong> This is a placeholder. Please review with a legal professional.
      </p>
    </div>
  )
}
