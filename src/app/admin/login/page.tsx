import { LoginForm } from '@/components/admin/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy-600">B2C Bazar</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Login</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
