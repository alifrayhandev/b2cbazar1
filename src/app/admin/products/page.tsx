import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { DeleteProductButton } from '@/components/admin/delete-product-button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Price', 'Stock', 'Category', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(products ?? []).map((p: {
              id: string; name: string; price: number; sale_price: number | null;
              stock_quantity: number; category: string | null; is_active: boolean; is_draft: boolean; low_stock_threshold: number
            }) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3">
                  {formatPrice(p.sale_price ?? p.price)}
                  {p.sale_price && <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(p.price)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={p.stock_quantity === 0 ? 'text-red-600 font-medium' : p.stock_quantity <= p.low_stock_threshold ? 'text-amber-600' : 'text-gray-700'}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category ?? '—'}</td>
                <td className="px-4 py-3">
                  {p.is_draft ? (
                    <span className="badge bg-gray-100 text-gray-600">Draft</span>
                  ) : p.is_active ? (
                    <span className="badge bg-green-100 text-green-700">Active</span>
                  ) : (
                    <span className="badge bg-red-100 text-red-600">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}`} className="text-navy-600 hover:underline text-xs font-medium">Edit</Link>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
