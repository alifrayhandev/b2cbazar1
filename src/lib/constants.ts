export const WHATSAPP_NUMBER = '8801350526254'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const DEFAULT_DELIVERY_INSIDE_DHAKA = 60
export const DEFAULT_DELIVERY_OUTSIDE_DHAKA = 120

export const CURRENCY_SYMBOL = '৳'

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
] as const

export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/
