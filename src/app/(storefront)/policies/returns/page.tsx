import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Return & Refund Policy' }

export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Return &amp; Refund Policy</h1>
      <p className="text-gray-500 text-sm mb-6">Last updated: <strong>[OWNER TO INSERT DATE]</strong></p>
      <div className="space-y-4 text-sm text-gray-600">
        <h2 className="text-base font-semibold text-gray-800">Returns</h2>
        <p>If you receive a damaged or incorrect item, please contact us via WhatsApp within 24 hours of delivery with photos of the item.</p>
        <h2 className="text-base font-semibold text-gray-800">Refunds</h2>
        <p>Approved refunds will be processed within <strong>[OWNER TO INSERT TIMEFRAME]</strong> via <strong>[OWNER TO INSERT METHOD]</strong>.</p>
        <h2 className="text-base font-semibold text-gray-800">Non-Returnable Items</h2>
        <p><strong>[OWNER TO INSERT any non-returnable product categories]</strong></p>
        <h2 className="text-base font-semibold text-gray-800">Contact</h2>
        <p>WhatsApp: 01350526254</p>
      </div>
      <p className="text-xs text-gray-400 mt-8 border-t pt-4">
        <strong>Note to owner:</strong> This is a placeholder. Please review with a legal professional before publishing.
      </p>
    </div>
  )
}
