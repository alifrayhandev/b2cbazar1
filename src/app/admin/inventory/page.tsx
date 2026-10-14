import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InventoryTable } from '@/components/admin/inventory-table'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inventory' }

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, stock_quantity, low_stock_threshold, is_active')
    .order('name')

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Inventory</h1>
      <InventoryTable products={products ?? []} />
    </div>
  )
}
