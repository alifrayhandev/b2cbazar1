import { formatPrice, generateOrderRef, normalizePhone, slugify } from '@/lib/utils'
import { checkoutSchema, productSchema } from '@/lib/validations'
import { BD_PHONE_REGEX } from '@/lib/constants'

// ─── Price formatting ─────────────────────────────────────────────────────────
describe('formatPrice', () => {
  it('formats integer price', () => expect(formatPrice(100)).toBe('৳100'))
  it('formats price with thousands', () => expect(formatPrice(1500)).toBe('৳1,500'))
  it('formats zero', () => expect(formatPrice(0)).toBe('৳0'))
})

// ─── Phone validation ─────────────────────────────────────────────────────────
describe('BD phone validation', () => {
  const valid = ['01712345678', '01312345678', '01912345678', '+8801712345678', '8801712345678']
  const invalid = ['0171234567', '02712345678', '1234567890', 'abcdefghijk', '']

  valid.forEach(p => it(`accepts ${p}`, () => expect(BD_PHONE_REGEX.test(p)).toBe(true)))
  invalid.forEach(p => it(`rejects ${p}`, () => expect(BD_PHONE_REGEX.test(p)).toBe(false)))
})

// ─── normalizePhone ───────────────────────────────────────────────────────────
describe('normalizePhone', () => {
  it('converts 01XXXXXXXXX to 8801XXXXXXXXX', () => expect(normalizePhone('01712345678')).toBe('8801712345678'))
  it('keeps 880 prefix', () => expect(normalizePhone('8801712345678')).toBe('8801712345678'))
})

// ─── Checkout schema ──────────────────────────────────────────────────────────
describe('checkoutSchema', () => {
  const valid = {
    customer_name: 'Rahim Uddin',
    customer_phone: '01712345678',
    delivery_address: 'House 5, Road 3, Dhanmondi, Dhaka',
    delivery_area: 'inside_dhaka' as const,
    items: [{ product_id: '00000000-0000-0000-0000-000000000001', quantity: 2 }],
  }

  it('accepts valid checkout data', () => expect(checkoutSchema.safeParse(valid).success).toBe(true))

  it('rejects empty cart', () => {
    const result = checkoutSchema.safeParse({ ...valid, items: [] })
    expect(result.success).toBe(false)
  })

  it('rejects invalid phone', () => {
    const result = checkoutSchema.safeParse({ ...valid, customer_phone: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects short name', () => {
    const result = checkoutSchema.safeParse({ ...valid, customer_name: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects short address', () => {
    const result = checkoutSchema.safeParse({ ...valid, delivery_address: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects quantity 0', () => {
    const result = checkoutSchema.safeParse({ ...valid, items: [{ product_id: '00000000-0000-0000-0000-000000000001', quantity: 0 }] })
    expect(result.success).toBe(false)
  })

  it('rejects invalid delivery area', () => {
    const result = checkoutSchema.safeParse({ ...valid, delivery_area: 'mars' })
    expect(result.success).toBe(false)
  })
})

// ─── Product schema ───────────────────────────────────────────────────────────
describe('productSchema', () => {
  const valid = { name: 'Test Product', slug: 'test-product', price: 250, stock_quantity: 10 }

  it('accepts valid product', () => expect(productSchema.safeParse(valid).success).toBe(true))
  it('rejects negative price', () => expect(productSchema.safeParse({ ...valid, price: -1 }).success).toBe(false))
  it('rejects negative stock', () => expect(productSchema.safeParse({ ...valid, stock_quantity: -1 }).success).toBe(false))
  it('rejects invalid slug', () => expect(productSchema.safeParse({ ...valid, slug: 'Bad Slug!' }).success).toBe(false))
})

// ─── Order reference ──────────────────────────────────────────────────────────
describe('generateOrderRef', () => {
  it('starts with B2C-', () => expect(generateOrderRef().startsWith('B2C-')).toBe(true))
  it('generates unique refs', () => {
    const refs = new Set(Array.from({ length: 100 }, generateOrderRef))
    expect(refs.size).toBe(100)
  })
})

// ─── slugify ──────────────────────────────────────────────────────────────────
describe('slugify', () => {
  it('converts spaces to hyphens', () => expect(slugify('Hello World')).toBe('hello-world'))
  it('removes special chars', () => expect(slugify('Product (New!)')).toBe('product-new'))
})
