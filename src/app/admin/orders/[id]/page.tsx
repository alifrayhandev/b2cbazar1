import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { OrderStatusForm } from '@/components/admin/order-status-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Detail' }

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Order {order.order_reference}</h1>
        <span className="badge bg-amber-100 text-amber-700 text-sm px-3 py-1">{order.status}</span>
      </div>

      <div className="card p-5 space-y-3 text-sm">
        <h2 className="font-semibold text-gray-700">Customer</h2>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <span className="text-gray-400">Name</span><span>{order.customer_name}</span>
          <span className="text-gray-400">Phone</span><span>{order.customer_phone}</span>
          <span className="text-gray-400">Address</span><span>{order.delivery_address}</span>
          <span className="text-gray-400">Area</span>
          <span>{order.delivery_area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</span>
          {order.order_notes && <><span className="text-gray-400">Notes</span><span>{order.order_notes}</span></>}
        </div>
      </div>

      <div className="card p-5 space-y-3 text-sm">
        <h2 className="font-semibold text-gray-700">Items</h2>
        {order.order_items.map((item: { id: string; product_name: string; quantity: number; product_price: number; line_total: number }) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.product_name} × {item.quantity} @ {formatPrice(item.product_price)}</span>
            <span className="font-medium">{formatPrice(item.line_total)}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
          <div className="flex justify-between font-bold text-gray-800"><span>Total (COD)</span><span>{formatPrice(order.total_amount)}</span></div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Update Order</h2>
        <OrderStatusForm order={order} />
      </div>
    </div>
  )
}
