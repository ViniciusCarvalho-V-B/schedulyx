import { createClient } from '@/utils/supabase/server'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { redirect } from 'next/navigation'

export default async function KanbanPage() {
  const supabase = await createClient()
  
  // Apenas admins ou profissionais deveriam ver isso livremente (RBAC), 
  // mas como ajustamos o RLS, os dados serão filtrados corretamente.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Buscar agendamentos no banco para popular o Kanban
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      service_name,
      status,
      profiles!appointments_client_id_fkey ( full_name )
    `)
    .in('status', ['pendente', 'confirmado', 'completed'])
    .order('date', { ascending: false })

  // Transformar os dados retornados para o tipo esperado pelo KanbanBoard
  const formattedTasks = (appointments || []).map((apt: any) => ({
    id: apt.id,
    title: apt.service_name || 'Sem Título',
    status: apt.status, // 'pendente', 'confirmado', 'completed'
    client_name: apt.profiles?.full_name || 'Cliente',
    service_name: apt.service_name,
    priority: 'medium',
  }))

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fluxo Kanban</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie o status operacional dos seus agendamentos.</p>
        </div>
      </header>

      {/* Board Layout */}
      <main className="flex-1 p-8 overflow-hidden flex flex-col">
        {error ? (
          <div className="w-full bg-error/10 border border-error p-4 rounded-xl text-error text-sm">
            Erro ao carregar o Kanban: {error.message}
          </div>
        ) : (
          <KanbanBoard initialTasks={formattedTasks} />
        )}
      </main>
    </div>
  )
}
