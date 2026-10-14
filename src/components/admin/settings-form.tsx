'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { settingsSchema, type SettingsInput } from '@/lib/validations'
import type { StoreSettings } from '@/types'

export function SettingsForm({ settings }: { settings: StoreSettings | null }) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings ? {
      whatsapp_number: settings.whatsapp_number,
      delivery_charge_inside_dhaka: settings.delivery_charge_inside_dhaka,
      delivery_charge_outside_dhaka: settings.delivery_charge_outside_dhaka,
      low_stock_threshold: settings.low_stock_threshold,
      store_name: settings.store_name,
      store_email: settings.store_email ?? '',
      store_phone: settings.store_phone ?? '',
      announcement: settings.announcement ?? '',
      currency_symbol: settings.currency_symbol,
    } : { store_name: 'B2C Bazar', currency_symbol: '৳', whatsapp_number: '8801350526254', delivery_charge_inside_dhaka: 60, delivery_charge_outside_dhaka: 120, low_stock_threshold: 5 },
  })

  async function onSubmit(data: SettingsInput) {
    setError(null)
    setSaved(false)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Failed to save.'); return }
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div>
        <label className="label">Store Name</label>
        <input className="input" {...register('store_name')} />
        {errors.store_name && <p className="text-xs text-red-500 mt-1">{errors.store_name.message}</p>}
      </div>
      <div>
        <label className="label">WhatsApp Number (international format)</label>
        <input className="input" placeholder="8801XXXXXXXXX" {...register('whatsapp_number')} />
        {errors.whatsapp_number && <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Delivery — Inside Dhaka (৳)</label>
          <input type="number" className="input" {...register('delivery_charge_inside_dhaka', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="label">Delivery — Outside Dhaka (৳)</label>
          <input type="number" className="input" {...register('delivery_charge_outside_dhaka', { valueAsNumber: true })} />
        </div>
      </div>
      <div>
        <label className="label">Low Stock Alert Threshold</label>
        <input type="number" className="input" {...register('low_stock_threshold', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="label">Store Email</label>
        <input type="email" className="input" {...register('store_email')} />
      </div>
      <div>
        <label className="label">Store Phone</label>
        <input className="input" {...register('store_phone')} />
      </div>
      <div>
        <label className="label">Currency Symbol</label>
        <input className="input w-24" {...register('currency_symbol')} />
      </div>
      <div>
        <label className="label">Store Announcement (shown on homepage)</label>
        <textarea rows={2} className="input resize-none" placeholder="Leave blank to hide" {...register('announcement')} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Settings saved successfully.</p>}
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}
