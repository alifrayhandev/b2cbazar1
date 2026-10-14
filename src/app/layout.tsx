import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'B2C Bazar', template: '%s | B2C Bazar' },
  description: 'Shop online at B2C Bazar — quality products delivered across Bangladesh.',
  keywords: ['B2C Bazar', 'online shopping', 'Bangladesh', 'buy online'],
  openGraph: {
    siteName: 'B2C Bazar',
    type: 'website',
    locale: 'en_BD',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
