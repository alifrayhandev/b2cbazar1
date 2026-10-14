import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
        <div>
          <p className="font-bold text-navy-600 text-base mb-2">B2C Bazar</p>
          <p>Quality products delivered across Bangladesh.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-green-600 hover:text-green-700 font-medium"
          >
            <MessageCircle size={16} />
            WhatsApp Support
          </a>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Policies</p>
          <ul className="space-y-1">
            <li><Link href="/policies/privacy" className="hover:text-navy-600">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-navy-600">Terms & Conditions</Link></li>
            <li><Link href="/policies/delivery" className="hover:text-navy-600">Delivery Policy</Link></li>
            <li><Link href="/policies/returns" className="hover:text-navy-600">Return & Refund</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-2">Payment</p>
          <p>Cash on Delivery (COD) only.</p>
          <p className="mt-2">Courier: Pathao Courier</p>
          <p className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} B2C Bazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
