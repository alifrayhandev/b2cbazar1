'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  stock_quantity: number
  low_stock_threshold: number
  is_active: boolean
}

export function InventoryTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [adjustments, setAdjustments] = useState<Record<string, { value: string; reason: string }>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleAdjust(productId: string) {
    const adj = adjustments[productId]
    if (!adj?.value) return
    const num = parseInt(adj.value, 10)
    if (isNaN(num) || num === 0) { setErrors(e => ({ ...e, [productId]: 'Enter a non-zero integer.' })); return }

    setLoading(productId)
    setErrors(e => ({ ...e, [productId]: '' }))
    const res = await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, adjustment: num, reason: adj.reason || undefined }),
    })
    const json = await res.json()
    setLoading(null)
    if (!res.ok) { setErrors(e => ({ ...e, [productId]: json.error ?? 'Failed.' })); return }
    setAdjustments(a => ({ ...a, [productId]: { value: '', reason: '' } }))
    router.refresh()
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Product', 'Stock', 'Threshold', 'Adjust', 'Reason', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map(p => {
            const adj = adjustments[p.id] ?? { value: '', reason: '' }
            const isLow = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{p.name}</td>
                <td className="px-4 py-3">
                  <span className={p.stock_quantity === 0 ? 'text-red-600 font-bold' : isLow ? 'text-amber-600 font-medium' : 'text-gray-700'}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.low_stock_threshold}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="+5 or -2"
                    value={adj.value}
                    onChange={e => setAdjustments(a => ({ ...a, [p.id]: { ...adj, value: e.target.value } }))}
                    className="input w-24 text-center"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="Reason (optional)"
                    value={adj.reason}
                    onChange={e => setAdjustments(a => ({ ...a, [p.id]: { ...adj, reason: e.target.value } }))}
                    className="input w-36"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleAdjust(p.id)}
                    disabled={loading === p.id || !adj.value}
                    className="btn-primary text-xs py-1.5 px-3 disabled:opacity-40"
                  >
                    {loading === p.id ? '…' : 'Apply'}
                  </button>
                  {errors[p.id] && <p className="text-xs text-red-500 mt-1">{errors[p.id]}</p>}
                </td>
              </tr>
            )
          })}
          {products.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No products.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
