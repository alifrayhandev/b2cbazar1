'use client'
import Image from 'next/image'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const { add, items, update } = useCart()
  const [qty, setQty] = useState(1)
  const cartItem = items.find(i => i.product_id === product.id)
  const effectivePrice = product.sale_price ?? product.price
  const isOutOfStock = product.stock_quantity === 0

  function handleAdd() {
    add({
      product_id: product.id,
      name: product.name,
      price: effectivePrice,
      image_url: product.image_url,
      quantity: qty,
      stock_quantity: product.stock_quantity,
    })
    setQty(1)
  }

  return (
    <article className="card flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-50">
        <Image
          src={product.image_url || `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-red-100 text-red-700 text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
        {product.sale_price && !isOutOfStock && (
          <span className="absolute top-2 left-2 badge bg-red-500 text-white">Sale</span>
        )}
        {product.is_featured && !isOutOfStock && (
          <span className="absolute top-2 right-2 badge bg-navy-600 text-white">Featured</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.category && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</span>
        )}
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="font-bold text-navy-600">{formatPrice(effectivePrice)}</span>
          {product.sale_price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5) && (
          <p className="text-xs text-amber-600">Only {product.stock_quantity} left</p>
        )}

        {!isOutOfStock && (
          <div className="flex items-center gap-2 mt-1">
            {cartItem ? (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => update(product.id, cartItem.quantity - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center text-sm font-medium">{cartItem.quantity}</span>
                <button
                  onClick={() => update(product.id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= product.stock_quantity}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-2 py-1.5 hover:bg-gray-50 rounded-l-lg"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                    className="px-2 py-1.5 hover:bg-gray-50 rounded-r-lg"
                    aria-label="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5"
                >
                  <ShoppingCart size={14} />
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
