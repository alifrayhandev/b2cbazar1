export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type DeliveryArea = 'inside_dhaka' | 'outside_dhaka'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  stock_quantity: number
  category: string | null
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  is_draft: boolean
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  name: string
  price: number
  image_url: string | null
  quantity: number
  stock_quantity: number
}

export interface Order {
  id: string
  order_reference: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_area: DeliveryArea
  order_notes: string | null
  subtotal: number
  delivery_fee: number
  total_amount: number
  payment_method: 'cod'
  status: OrderStatus
  admin_notes: string | null
  courier_name: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  line_total: number
}

export interface StoreSettings {
  id: string
  whatsapp_number: string
  delivery_charge_inside_dhaka: number
  delivery_charge_outside_dhaka: number
  low_stock_threshold: number
  store_name: string
  store_email: string | null
  store_phone: string | null
  announcement: string | null
  currency_symbol: string
  updated_at: string
}

export interface InventoryAdjustment {
  id: string
  product_id: string
  adjustment: number
  reason: string | null
  created_at: string
}
