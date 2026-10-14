'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading}
          className="text-xs text-red-600 font-medium hover:underline disabled:opacity-50">
          {loading ? 'Deleting…' : 'Confirm'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} aria-label={`Delete ${productName}`}
      className="text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 size={14} />
    </button>
  )
}
