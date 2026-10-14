import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/storefront/header'
import { Footer } from '@/components/storefront/footer'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  )
}
