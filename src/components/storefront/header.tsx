'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export function Header() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-navy-600 tracking-tight">
          B2C Bazar
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-navy-600 transition-colors">Shop</Link>
          <Link href="/policies/delivery" className="hover:text-navy-600 transition-colors">Delivery</Link>
          <Link href="/policies/returns" className="hover:text-navy-600 transition-colors">Returns</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            aria-label={`Cart with ${totalItems} items`}
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ShoppingCart size={22} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-navy-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm text-gray-600">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-navy-600">Shop</Link>
          <Link href="/policies/delivery" onClick={() => setMenuOpen(false)} className="hover:text-navy-600">Delivery</Link>
          <Link href="/policies/returns" onClick={() => setMenuOpen(false)} className="hover:text-navy-600">Returns</Link>
        </div>
      )}
    </header>
  )
}
