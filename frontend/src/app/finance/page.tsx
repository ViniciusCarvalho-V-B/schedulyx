import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FinancialSummary } from '@/components/finance/FinancialSummary'
import { TransactionTable } from '@/components/finance/TransactionTable'

export default async function FinancePage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financeiro</h1>
          <p className="text-sm text-text-muted mt-1">Visão geral de faturamento e extrato unificado.</p>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <FinancialSummary />
          <TransactionTable />
        </div>
      </main>
    </div>
  )
}
