import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/validations'
import { generateOrderRef } from '@/lib/utils'

// Simple in-memory rate limit: max 3 orders per IP per minute
const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return NextResponse.json({ error: firstError.message }, { status: 422 })
  }

  const { customer_name, customer_phone, delivery_address, delivery_area, order_notes, items } = parsed.data

  const supabase = await createClient()
  const orderRef = generateOrderRef()

  const { data, error } = await supabase.rpc('create_order', {
    p_order_reference: orderRef,
    p_customer_name: customer_name,
    p_customer_phone: customer_phone,
    p_delivery_address: delivery_address,
    p_delivery_area: delivery_area,
    p_order_notes: order_notes ?? null,
    p_items: items,
  })

  if (error) {
    const msg = error.message.includes('Insufficient stock')
      ? error.message
      : error.message.includes('not found or unavailable')
      ? 'One or more products are no longer available.'
      : 'Failed to place order. Please try again.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json({
    order_reference: (data as { order_reference: string }).order_reference,
    total_amount: (data as { total_amount: number }).total_amount,
  }, { status: 201 })
}
