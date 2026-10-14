import { z } from 'zod'
import { BD_PHONE_REGEX } from './constants'

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customer_phone: z
    .string()
    .regex(BD_PHONE_REGEX, 'Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX)'),
  delivery_address: z.string().min(10, 'Please enter a full delivery address').max(500),
  delivery_area: z.enum(['inside_dhaka', 'outside_dhaka']),
  order_notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1, 'Cart is empty'),
})

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive().optional().nullable(),
  stock_quantity: z.number().int().min(0),
  category: z.string().max(100).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  is_draft: z.boolean().default(false),
  low_stock_threshold: z.number().int().min(0).default(5),
})

export const settingsSchema = z.object({
  whatsapp_number: z.string().min(10).max(20),
  delivery_charge_inside_dhaka: z.number().min(0),
  delivery_charge_outside_dhaka: z.number().min(0),
  low_stock_threshold: z.number().int().min(0),
  store_name: z.string().min(1).max(100),
  store_email: z.string().email().optional().nullable(),
  store_phone: z.string().optional().nullable(),
  announcement: z.string().max(500).optional().nullable(),
  currency_symbol: z.string().min(1).max(5),
})

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  admin_notes: z.string().max(1000).optional().nullable(),
  courier_name: z.string().max(100).optional().nullable(),
  tracking_number: z.string().max(100).optional().nullable(),
})

export const inventoryAdjustSchema = z.object({
  product_id: z.string().uuid(),
  adjustment: z.number().int(),
  reason: z.string().max(200).optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>
