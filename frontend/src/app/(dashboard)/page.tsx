import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Buscar Agendamentos de Hoje
  const today = new Date().toISOString().split('T')[0]
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('date', today)
    .order('time', { ascending: true })

  // Buscar Tarefas Pendentes
  const { data: pendingTasks } = await supabase
    .from('appointments')
    .select('id, service_name, status, date, time')
    .in('status', ['pendente'])
    .order('date', { ascending: true })
    .limit(5)

  // Calcular métricas simples do mês (mock simplificado para agora)
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type')
  
  let faturamentoMes = 0
  if (transactions) {
    faturamentoMes = transactions
      .filter(t => t.type === 'entrada' || t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0)
  }

  const upcomingCount = appointments?.length || 0
  const tasksCount = pendingTasks?.length || 0

  return (
    <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full overflow-y-auto bg-background">
      {/* Top Row (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Metric Card 1 */}
        <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Próximos Agendamentos (Hoje)</span>
            <span className="material-symbols-outlined text-text-muted">calendar_today</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-on-surface">{upcomingCount}</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Tarefas Pendentes</span>
            <span className="material-symbols-outlined text-text-muted">view_kanban</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-on-surface">{tasksCount}</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Faturamento</span>
            <span className="material-symbols-outlined text-text-muted">payments</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-secondary-container">
              R$ {faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Split) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Mini Agenda */}
          <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Agenda Hoje</h2>
              <Link href="/agenda" className="px-3 py-1.5 border border-border text-text-muted hover:text-white hover:bg-surface-container-high rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                Ver Agenda <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              {appointments && appointments.length > 0 ? appointments.map(apt => (
                <div key={apt.id} className="flex gap-4 items-start group">
                  <div className="w-16 text-right pt-1">
                    <span className="text-sm font-medium text-text-muted">{apt.time}</span>
                  </div>
                  <div className="flex-1 bg-surface-container-high border border-border rounded-lg p-4 group-hover:border-primary transition-colors flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium text-on-surface">{apt.service_name}</h3>
                      <p className="text-sm text-text-muted">Valor: {Number(apt.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    {apt.status === 'pendente' && <span className="px-2 py-0.5 rounded text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20">Pendente</span>}
                    {apt.status === 'confirmado' && <span className="px-2 py-0.5 rounded text-xs font-bold text-primary bg-primary/10 border border-primary/20">Confirmado</span>}
                    {apt.status === 'completed' && <span className="px-2 py-0.5 rounded text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">Concluído</span>}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-text-muted">Nenhum agendamento para hoje.</div>
              )}
            </div>
          </div>

          {/* Tarefas Urgentes */}
          <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">priority_high</span>
                Tarefas Pendentes
              </h2>
            </div>
            <div className="space-y-0">
              {pendingTasks && pendingTasks.length > 0 ? pendingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between py-3 border-b border-border hover:bg-border/50 transition-colors px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-text-muted flex items-center justify-center"></div>
                    <span className="text-sm text-on-surface">{task.service_name} ({task.date})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-primary bg-primary/10 border border-primary/20">Pendente</span>
                </div>
              )) : (
                <div className="text-center py-4 text-text-muted">Nenhuma tarefa pendente.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Visão Geral de Ganhos */}
        <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-on-surface">Visão Geral de Ganhos</h2>
            <button className="material-symbols-outlined text-text-muted hover:text-on-surface transition-colors">more_horiz</button>
          </div>
          
          <div className="h-40 w-full mb-6 rounded-lg bg-surface-container-low border border-border flex items-end px-2 py-2 gap-1 relative overflow-hidden">
            <div className="w-full h-full absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background"></div>
            <div className="w-1/6 bg-border h-1/3 rounded-t-sm relative z-10"></div>
            <div className="w-1/6 bg-border h-1/2 rounded-t-sm relative z-10"></div>
            <div className="w-1/6 bg-border h-2/5 rounded-t-sm relative z-10"></div>
            <div className="w-1/6 bg-primary h-4/5 rounded-t-sm relative z-10 opacity-80"></div>
            <div className="w-1/6 bg-border h-2/3 rounded-t-sm relative z-10"></div>
            <div className="w-1/6 bg-border h-1/4 rounded-t-sm relative z-10"></div>
          </div>
          
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Transações Recentes</h3>
          <div className="space-y-4">
            {transactions && transactions.slice(0, 4).map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-surface-container-high border border-border flex items-center justify-center">
                    <span className={`material-symbols-outlined text-sm ${tx.type === 'entrada' || tx.type === 'income' ? 'text-primary' : 'text-error'}`}>
                      {tx.type === 'entrada' || tx.type === 'income' ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{tx.type === 'entrada' || tx.type === 'income' ? 'Entrada' : 'Saída'}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${tx.type === 'entrada' || tx.type === 'income' ? 'text-on-surface' : 'text-text-muted'}`}>
                  {tx.type === 'entrada' || tx.type === 'income' ? '+' : '-'} {Number(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
          </div>

          <Link href="/finance" className="mt-6 w-full px-4 py-2 flex items-center justify-center border border-border rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-surface-container-high transition-colors">
            Ver Relatório Completo
          </Link>
        </div>
      </div>
    </main>
  )
}
