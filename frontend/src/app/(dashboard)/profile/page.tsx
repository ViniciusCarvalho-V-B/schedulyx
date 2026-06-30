import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditor from '@/components/profile/ProfileEditor'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Auth user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, avatar_url')
    .eq('id', user.id)
    .single()

  const userProfile = profile ?? { full_name: null, phone: null, avatar_url: null }

  // Stat: total appointments
  const { count: totalAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })

  // Stat: revenue (transactions where type is 'entrada' or 'income')
  const { data: revenueData } = await supabase
    .from('transactions')
    .select('amount')
    .in('type', ['entrada', 'income'])

  const totalRevenue = (revenueData ?? []).reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  )

  // Stat: appointments this month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const { count: monthAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('date', firstDayOfMonth)
    .lte('date', lastDayOfMonth)

  // Format currency
  const formattedRevenue = totalRevenue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  // Member since
  const memberSince = new Date(user.created_at).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="flex-1 overflow-y-auto p-gutter lg:p-margin relative bg-background">
      <div className="max-w-5xl mx-auto space-y-gutter">
        {/* Page title */}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Meu Perfil
          </h1>
          <p className="text-text-muted text-body-md mt-1">
            Gerencie suas informações pessoais e acompanhe seus resultados.
          </p>
        </div>

        {/* Profile editor (client component for interactivity) */}
        <ProfileEditor
          profile={userProfile}
          email={user.email ?? ''}
        />

        {/* Statistics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          {/* Total de Agendamentos */}
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
                    Total de Agendamentos
                  </p>
                  <p className="text-4xl font-bold text-on-surface mt-3">
                    {totalAppointments ?? 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    calendar_month
                  </span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">
                Desde o início
              </p>
            </div>
          </div>

          {/* Faturamento Total */}
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
                    Faturamento Total
                  </p>
                  <p className="text-4xl font-bold text-on-surface mt-3">
                    {formattedRevenue}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent">
                    payments
                  </span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">
                Receitas acumuladas
              </p>
            </div>
          </div>

          {/* Agendamentos Este Mês */}
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium uppercase tracking-wider">
                    Agendamentos Este Mês
                  </p>
                  <p className="text-4xl font-bold text-on-surface mt-3">
                    {monthAppointments ?? 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    event_available
                  </span>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-3">
                {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Account info card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-on-surface font-medium text-lg flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-text-muted">
              account_circle
            </span>
            Informações da Conta
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-text-muted text-sm">E-mail</span>
              <span className="text-on-surface text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-text-muted text-sm">Membro desde</span>
              <span className="text-on-surface text-sm capitalize">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-text-muted text-sm">Telefone</span>
              <span className="text-on-surface text-sm">
                {userProfile.phone || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-text-muted text-sm">Autenticação</span>
              <span className="text-on-surface text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Ativa
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
