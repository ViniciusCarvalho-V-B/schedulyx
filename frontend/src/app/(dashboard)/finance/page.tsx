import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FinancialSummary } from '@/components/finance/FinancialSummary'
import { TransactionTable } from '@/components/finance/TransactionTable'
import { TransactionModal } from '@/components/finance/TransactionModal'

export default async function FinancePage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Fetch das transações
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  // Fetch dos agendamentos (Para Previsão de Caixa)
  const { data: appointments } = await supabase
    .from('appointments')
    .select('price, status')
    .eq('status', 'confirmado')

  // Cálculos financeiros
  const txs = transactions || []
  let receitaRealizada = 0
  let despesas = 0

  txs.forEach((tx) => {
    if (tx.type === 'entrada' && tx.status === 'pago') {
      receitaRealizada += Number(tx.amount)
    } else if (tx.type === 'saida') {
      despesas += Number(tx.amount)
    }
  })

  // Calcula Previsão de Caixa (Agendamentos confirmados que ainda não viraram dinheiro)
  let receitaPrevista = 0
  if (appointments) {
    appointments.forEach((apt) => {
      receitaPrevista += Number(apt.price)
    })
  }

  const lucroLiquido = receitaRealizada - despesas

  return (
    <>
      <header className="h-20 border-b border-border bg-surface flex items-center justify-between px-8 shrink-0 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financeiro</h1>
          <p className="text-sm text-text-muted mt-1">Visão geral de faturamento, extrato unificado e previsão de caixa.</p>
        </div>
        <TransactionModal />
      </header>

      <div className="flex-1 p-8 overflow-y-auto bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <FinancialSummary 
            receita={receitaRealizada} 
            receitaPrevista={receitaPrevista}
            despesa={despesas} 
            lucro={lucroLiquido} 
          />
          <TransactionTable transactions={txs} />
        </div>
      </div>
    </>
  )
}
