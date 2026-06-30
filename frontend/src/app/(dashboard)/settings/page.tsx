import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Obter o perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <header className="h-20 border-b border-border bg-surface flex items-center justify-between px-8 shrink-0 z-10 relative">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configurações da Conta</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie seu perfil e preferências do sistema.</p>
        </div>
      </header>

      <div className="p-8 flex-1 overflow-auto bg-background">
        <div className="max-w-4xl mx-auto">
          <SettingsForm user={user} profile={profile} />
        </div>
      </div>
    </>
  )
}
