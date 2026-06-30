import { createClient } from '@/utils/supabase/server'
import { AppointmentForm } from '@/components/dashboard/AppointmentForm'
import Sidebar from '@/components/layout/Sidebar'

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
      {/* Sidebar - Componente Unificado */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 w-full">
        {/* Header */}
        <header className="h-20 border-b border-border bg-surface flex items-center justify-between px-8 shrink-0 z-10 relative">
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
