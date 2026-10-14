import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-6">Last updated: <strong>[OWNER TO INSERT DATE]</strong></p>
      <p>B2C Bazar (&quot;we&quot;, &quot;us&quot;) operates this website. This policy explains how we collect and use your information when you place an order.</p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-600">
        <li>Name, phone number, and delivery address provided at checkout</li>
        <li>Order details including products and quantities</li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 mb-2">How We Use It</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-600">
        <li>To process and deliver your order</li>
        <li>To contact you about your order via phone or WhatsApp</li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 mb-2">Data Sharing</h2>
      <p className="text-gray-600">We share your delivery address with our courier partner (Pathao Courier) solely for delivery purposes. We do not sell your data.</p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-gray-600">For privacy concerns, contact us via WhatsApp: <strong>[OWNER TO INSERT CONTACT]</strong>.</p>
      <p className="text-xs text-gray-400 mt-8 border-t pt-4">
        <strong>Note to owner:</strong> This is a placeholder policy. Please review with a legal professional before publishing.
      </p>
    </div>
  )
}
