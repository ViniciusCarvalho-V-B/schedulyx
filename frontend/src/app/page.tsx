import { createClient } from '@/utils/supabase/server'
import { AppointmentForm } from '@/components/AppointmentForm'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'

export default async function DashboardPage() {
  const supabase = await createClient()

  // O middleware já garante que temos um usuário se chegarmos aqui, mas validamos por precaução
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })

  return (
    <div className="min-h-screen bg-background text-on-surface flex w-full">
      {/* Sidebar - Muted Nordic Style */}
      <aside className="w-64 border-r border-border bg-surface p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <svg fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
              <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="8" y="8" />
              <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="16" y="16" />
              <rect fill="#d97707" height="8" rx="1" style={{ filter: "drop-shadow(0px 0px 8px rgba(217,119,7,0.6))" }} width="8" x="16" y="16" />
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">schedulyx</span>
          </div>
          <nav className="flex flex-col gap-2">
            <div className="px-4 py-2.5 bg-primary-container/10 border border-primary/20 text-primary rounded-lg font-medium text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Agenda
            </div>
            <div className="px-4 py-2.5 text-text-muted hover:text-white rounded-lg font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
              Kanban
            </div>
            <div className="px-4 py-2.5 text-text-muted hover:text-white rounded-lg font-medium text-sm flex items-center gap-3 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              Finanças
            </div>
          </nav>
        </div>
        
        {/* User Info & Settings */}
        <div className="flex flex-col border-t border-border pt-4 mt-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-surface-container-high border border-border flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">Meu Perfil</span>
              <span className="text-xs text-text-muted truncate w-36">{user?.email}</span>
            </div>
          </div>
          <DeleteAccountModal />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Sua Agenda</h1>
          {/* Componente que engatilha o Modal */}
          <AppointmentForm />
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-auto bg-background">
          <div className="max-w-5xl mx-auto">
            
            {appointments && appointments.length > 0 ? (
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-lowest border-b border-border text-text-muted">
                    <tr>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Serviço</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Data</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Horário</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Valor</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-6 py-4 text-white font-medium">{apt.service_name}</td>
                        <td className="px-6 py-4 text-on-surface-variant group-hover:text-white transition-colors">{apt.appointment_date}</td>
                        <td className="px-6 py-4 text-on-surface-variant group-hover:text-white transition-colors">{apt.appointment_time}</td>
                        <td className="px-6 py-4 text-secondary-container font-medium">
                          R$ {apt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary/30">
                            {apt.status === 'confirmed' ? 'Confirmado' : apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-surface border border-dashed border-border rounded-xl">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4 border border-border">
                  <span className="material-symbols-outlined text-[32px] text-border-bright">event_busy</span>
                </div>
                <h3 className="text-lg font-medium text-white">Nenhum agendamento</h3>
                <p className="text-text-muted mt-2 max-w-sm text-center text-sm">
                  Você ainda não tem nenhum horário agendado. Clique no botão acima para criar o primeiro fluxo e ativar o Kanban!
                </p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  )
}
