import { CURRENCY_SYMBOL } from './constants'

export function formatPrice(amount: number, symbol = CURRENCY_SYMBOL): string {
  return `${symbol}${amount.toLocaleString('en-BD')}`
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('880')) return digits
  if (digits.startsWith('0')) return '88' + digits
  return '88' + digits
}

export function generateOrderRef(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `B2C-${ts}-${rand}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
