'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { orderStatusSchema, type OrderStatusInput } from '@/lib/validations'
import { ORDER_STATUSES } from '@/lib/constants'
import type { Order } from '@/types'

export function OrderStatusForm({ order }: { order: Order }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<OrderStatusInput>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      status: order.status,
      admin_notes: order.admin_notes ?? '',
      courier_name: order.courier_name ?? '',
      tracking_number: order.tracking_number ?? '',
    },
  })

  async function onSubmit(data: OrderStatusInput) {
    setError(null)
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Failed to update order.'); return }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
      <div>
        <label className="label">Status</label>
        <select className="input" {...register('status')}>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Courier Name</label>
        <input className="input" placeholder="e.g. Pathao Courier" {...register('courier_name')} />
      </div>
      <div>
        <label className="label">Tracking Number</label>
        <input className="input" placeholder="Enter tracking number manually" {...register('tracking_number')} />
      </div>
      <div>
        <label className="label">Admin Notes</label>
        <textarea rows={2} className="input resize-none" {...register('admin_notes')} />
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Saving…' : 'Update Order'}
      </button>
    </form>
  )
}
