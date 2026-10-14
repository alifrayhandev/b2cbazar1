import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Delivery Policy' }

export default function DeliveryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Delivery Policy</h1>
      <div className="space-y-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold text-gray-800">Delivery Areas</h2>
        <p>We deliver across Bangladesh via Pathao Courier.</p>
        <h2 className="text-base font-semibold text-gray-800">Delivery Charges</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Inside Dhaka: ৳60 (configurable)</li>
          <li>Outside Dhaka: ৳120 (configurable)</li>
        </ul>
        <h2 className="text-base font-semibold text-gray-800">Delivery Time</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Inside Dhaka: 1–3 business days</li>
          <li>Outside Dhaka: 3–7 business days</li>
        </ul>
        <h2 className="text-base font-semibold text-gray-800">Tracking</h2>
        <p>Once your order is shipped, we will share the tracking number via WhatsApp.</p>
        <h2 className="text-base font-semibold text-gray-800">Payment</h2>
        <p>Cash on Delivery (COD). Please have the exact amount ready upon delivery.</p>
      </div>
    </div>
  )
}
