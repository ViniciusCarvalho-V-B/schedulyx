import { createClient } from '@/utils/supabase/server'

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isIncome(type: string): boolean {
  return type === 'entrada' || type === 'income'
}

function isExpense(type: string): boolean {
  return type === 'saída' || type === 'expense'
}

export default async function FinancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar todas as transações
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  // Buscar agendamentos pendentes
  const { data: pendingAppointments } = await supabase
    .from('appointments')
    .select('id, service_name, client_name, date, time, price, status')
    .eq('status', 'pendente')
    .order('date', { ascending: true })

  // Calcular métricas
  const receitaTotal = (transactions ?? [])
    .filter(t => isIncome(t.type))
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const despesasTotal = (transactions ?? [])
    .filter(t => isExpense(t.type))
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const pendingCount = pendingAppointments?.length ?? 0
  const pendingSum = (pendingAppointments ?? [])
    .reduce((acc, a) => acc + Number(a.price ?? 0), 0)

  // Transações recentes para a listagem (últimas 20)
  const recentTransactions = (transactions ?? []).slice(0, 20)

  return (
    <main className="flex-1 overflow-y-auto p-gutter bg-background">
      <div className="max-w-[1440px] mx-auto space-y-gutter">

        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-1">Financeiro</h2>
            <p className="text-sm text-text-muted">
              Visão geral das finanças e transações em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-surface border border-border rounded-lg text-text-muted text-sm font-medium hover:text-on-surface hover:border-border-bright transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Exportar
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

          {/* Receita Total */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between hover:border-border-bright transition-colors">
            <div className="flex justify-between items-start mb-5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Receita Total</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-xl">trending_up</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface">{formatBRL(receitaTotal)}</div>
              <div className="text-sm text-text-muted mt-1">
                Soma de todas as entradas registradas
              </div>
            </div>
          </div>

          {/* Pagamentos Pendentes */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between hover:border-border-bright transition-colors">
            <div className="flex justify-between items-start mb-5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pagamentos Pendentes</span>
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-accent text-xl">schedule</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{formatBRL(pendingSum)}</div>
              <div className="text-sm text-text-muted mt-1">
                {pendingCount} {pendingCount === 1 ? 'agendamento pendente' : 'agendamentos pendentes'}
              </div>
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between hover:border-border-bright transition-colors">
            <div className="flex justify-between items-start mb-5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Despesas</span>
              <div className="w-10 h-10 rounded-lg bg-error/10 border border-error/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-xl">trending_down</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface">{formatBRL(despesasTotal)}</div>
              <div className="text-sm text-text-muted mt-1">
                Soma de todas as saídas registradas
              </div>
            </div>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-border-bright transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-xl">account_balance</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Saldo Líquido</span>
                <p className="text-sm text-text-muted">Receita total menos despesas</p>
              </div>
            </div>
            <div className={`text-2xl font-bold ${receitaTotal - despesasTotal >= 0 ? 'text-emerald-500' : 'text-error'}`}>
              {formatBRL(receitaTotal - despesasTotal)}
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-surface border border-border rounded-xl hover:border-border-bright transition-colors">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-text-muted">receipt_long</span>
              Transações Recentes
            </h3>
            <span className="text-sm text-text-muted">
              {recentTransactions.length} {recentTransactions.length === 1 ? 'transação' : 'transações'}
            </span>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => {
                const income = isIncome(tx.type)
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Ícone da Transação */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        income
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'bg-error/10 border border-error/20'
                      }`}>
                        <span className={`material-symbols-outlined text-lg ${
                          income ? 'text-emerald-500' : 'text-error'
                        }`}>
                          {income ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                      </div>

                      {/* Descrição */}
                      <div>
                        <p className="text-sm font-medium text-on-surface">
                          {tx.description || (income ? 'Entrada' : 'Saída')}
                        </p>
                        <p className="text-xs text-text-muted">
                          {tx.created_at ? formatDate(tx.created_at.split('T')[0]) : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Valor */}
                    <span className={`text-sm font-semibold tabular-nums ${
                      income ? 'text-emerald-500' : 'text-error'
                    }`}>
                      {income ? '+' : '−'} {formatBRL(Number(tx.amount))}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Estado Vazio */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-border flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-text-muted">account_balance_wallet</span>
              </div>
              <h4 className="text-base font-semibold text-on-surface mb-1">
                Nenhuma transação registrada
              </h4>
              <p className="text-sm text-text-muted text-center max-w-sm">
                Suas transações financeiras aparecerão aqui assim que forem registradas no sistema.
              </p>
            </div>
          )}
        </div>

        {/* Agendamentos Pendentes (detalhe) */}
        {pendingCount > 0 && (
          <div className="bg-surface border border-border rounded-xl hover:border-border-bright transition-colors">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-accent">pending_actions</span>
                Agendamentos Aguardando Pagamento
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-accent bg-accent/10 border border-accent/20">
                {pendingCount}
              </span>
            </div>
            <div className="divide-y divide-border">
              {(pendingAppointments ?? []).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-accent text-lg">event</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{apt.service_name}</p>
                      <p className="text-xs text-text-muted">
                        {apt.client_name ? `${apt.client_name} · ` : ''}
                        {formatDate(apt.date)} às {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-accent tabular-nums">
                      {formatBRL(Number(apt.price ?? 0))}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20">
                      Pendente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
