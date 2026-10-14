import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Overview' }

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return supabase
}

export default async function AdminOverviewPage() {
  const supabase = await verifyAdmin()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: confirmedOrders },
    { count: deliveredOrders },
    { count: totalProducts },
    { data: products },
    { data: revenueOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('stock_quantity, low_stock_threshold').eq('is_active', true),
    supabase.from('orders').select('total_amount').in('status', ['confirmed', 'processing', 'shipped', 'delivered']),
  ])

  const lowStockCount = (products ?? []).filter(
    (p: { stock_quantity: number; low_stock_threshold: number }) =>
      p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
  ).length

  const revenue = (revenueOrders ?? []).reduce(
    (sum: number, o: { total_amount: number }) => sum + Number(o.total_amount), 0
  )

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Orders', value: pendingOrders ?? 0, icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed', value: confirmedOrders ?? 0, icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
    { label: 'Delivered', value: deliveredOrders ?? 0, icon: ShoppingBag, color: 'text-navy-600 bg-navy-50' },
    { label: 'Products', value: totalProducts ?? 0, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Revenue (COD)', value: formatPrice(revenue), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
