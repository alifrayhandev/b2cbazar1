import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/admin/settings-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Store Settings' }

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: settings } = await supabase.from('store_settings').select('*').single()

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Store Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
