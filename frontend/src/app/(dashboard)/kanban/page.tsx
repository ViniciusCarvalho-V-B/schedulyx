import { createClient } from '@/utils/supabase/server'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export default async function KanbanPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Buscar todos os agendamentos do usuário
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, service_name, client_name, date, time, status, price')
    .order('date', { ascending: true })

  // Mapear para o formato de Task do Kanban
  const tasks = (appointments || []).map(apt => ({
    id: apt.id,
    title: apt.service_name,
    client_name: apt.client_name || undefined,
    service_name: apt.service_name,
    date: apt.date,
    time: apt.time,
    price: apt.price ? Number(apt.price) : undefined,
    priority: 'medium' as const,
    status: (apt.status || 'pendente') as 'pendente' | 'confirmado' | 'completed',
  }))

  const totalTasks = tasks.length

  return (
    <main className="flex-1 overflow-hidden bg-background flex flex-col p-6">
      {/* Header do Board */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">Quadro de Agendamentos</h1>
          <p className="text-sm text-text-muted mt-1">
            {totalTasks} {totalTasks === 1 ? 'agendamento' : 'agendamentos'} no total
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      {totalTasks > 0 ? (
        <KanbanBoard initialTasks={tasks} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-4 block">view_kanban</span>
            <h3 className="text-lg font-medium text-on-surface mb-2">Nenhum agendamento ainda</h3>
            <p className="text-sm text-text-muted max-w-sm">
              Crie seu primeiro agendamento clicando em &quot;Novo Agendamento&quot; no canto superior direito.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
