import { CheckoutForm } from '@/components/storefront/checkout-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
