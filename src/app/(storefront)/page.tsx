import { createClient } from '@/lib/supabase/server'
import { StorefrontShell } from '@/components/storefront/storefront-shell'
import type { Product, StoreSettings } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: products }, { data: settings }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_draft', false)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('store_settings').select('*').single(),
  ])

  const categories = Array.from(
    new Set((products ?? []).map((p: Product) => p.category).filter(Boolean))
  ) as string[]

  return (
    <StorefrontShell
      products={(products ?? []) as Product[]}
      categories={categories}
      announcement={(settings as StoreSettings | null)?.announcement ?? null}
    />
  )
}
