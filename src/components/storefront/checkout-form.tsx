'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export function CheckoutForm() {
  const { items, remove, update, subtotal, clear } = useCart()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery_area: 'inside_dhaka', items: [] },
  })

  const deliveryArea = watch('delivery_area')

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link href="/" className="btn-primary mt-4 inline-block">Continue Shopping</Link>
      </div>
    )
  }

  async function onSubmit(data: CheckoutInput) {
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })) }),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? 'Failed to place order. Please try again.')
        return
      }
      clear()
      router.push(`/order-confirmation/${json.order_reference}`)
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Cart summary */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold text-gray-800">Your Items</h2>
        {items.map(item => (
          <div key={item.product_id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => update(item.product_id, item.quantity - 1)}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50">−</button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button type="button" onClick={() => update(item.product_id, item.quantity + 1)}
                disabled={item.quantity >= item.stock_quantity}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-40">+</button>
            </div>
            <p className="text-sm font-semibold w-20 text-right">{formatPrice(item.price * item.quantity)}</p>
            <button type="button" onClick={() => remove(item.product_id)} aria-label="Remove item"
              className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </section>

      {/* Customer details */}
      <section className="card p-4 space-y-4">
        <h2 className="font-semibold text-gray-800">Delivery Details</h2>

        <div>
          <label className="label" htmlFor="customer_name">Full Name *</label>
          <input id="customer_name" className="input" {...register('customer_name')} />
          {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="customer_phone">Phone Number *</label>
          <input id="customer_phone" className="input" placeholder="01XXXXXXXXX" {...register('customer_phone')} />
          {errors.customer_phone && <p className="text-xs text-red-500 mt-1">{errors.customer_phone.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="delivery_address">Full Delivery Address *</label>
          <textarea id="delivery_address" rows={3} className="input resize-none"
            placeholder="House/Flat, Road, Area, District" {...register('delivery_address')} />
          {errors.delivery_address && <p className="text-xs text-red-500 mt-1">{errors.delivery_address.message}</p>}
        </div>

        <div>
          <label className="label">Delivery Area *</label>
          <div className="flex gap-4">
            {(['inside_dhaka', 'outside_dhaka'] as const).map(area => (
              <label key={area} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={area} {...register('delivery_area')} className="accent-navy-600" />
                <span className="text-sm">{area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="order_notes">Order Notes (optional)</label>
          <textarea id="order_notes" rows={2} className="input resize-none"
            placeholder="Any special instructions…" {...register('order_notes')} />
        </div>
      </section>

      {/* Order summary */}
      <section className="card p-4 space-y-2 text-sm">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery ({deliveryArea === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
          <span className="text-gray-400 italic text-xs">Calculated at server</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-2 mt-2">
          <span>Total</span><span className="text-navy-600">Confirmed on order</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">💵 Payment: Cash on Delivery (COD)</p>
      </section>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {serverError}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
        {submitting ? 'Placing Order…' : 'Place Order (Cash on Delivery)'}
      </button>
    </form>
  )
}
