import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { WHATSAPP_URL } from '@/lib/constants'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed' }

export default async function OrderConfirmationPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_reference', ref)
    .single()

  if (!order) notFound()

  const waMessage = `Hi B2C Bazar! I just placed order ${order.order_reference}. Please confirm.`

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Order Placed!</h1>
        <p className="text-gray-500 mt-1">Thank you, {order.customer_name}.</p>
      </div>

      <div className="card p-5 space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order Reference</span>
          <span className="font-bold text-navy-600">{order.order_reference}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment</span>
          <span className="font-medium">Cash on Delivery</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="font-medium">{order.delivery_area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-1">
          {order.order_items.map((item: { id: string; product_name: string; quantity: number; line_total: number }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
              <span>{formatPrice(item.line_total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span><span>{formatPrice(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
            <span>Total (COD)</span><span className="text-navy-600">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          <MessageCircle size={18} />
          Confirm via WhatsApp
        </a>
        <Link href="/" className="btn-secondary w-full text-center block py-3">
          Continue Shopping
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Save your order reference: <strong>{order.order_reference}</strong>
      </p>
    </div>
  )
}
