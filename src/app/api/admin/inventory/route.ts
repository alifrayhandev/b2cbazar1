import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inventoryAdjustSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = inventoryAdjustSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 })

  const { product_id, adjustment, reason } = parsed.data

  // Fetch current stock
  const { data: product } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', product_id)
    .single()

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const newQty = product.stock_quantity + adjustment
  if (newQty < 0) return NextResponse.json({ error: 'Stock cannot go below zero.' }, { status: 400 })

  const { error: updateError } = await supabase
    .from('products')
    .update({ stock_quantity: newQty })
    .eq('id', product_id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })

  await supabase.from('inventory_adjustments').insert({ product_id, adjustment, reason: reason ?? null })

  return NextResponse.json({ stock_quantity: newQty })
}
