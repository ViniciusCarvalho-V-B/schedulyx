interface FinancialSummaryProps {
  receita: number;
  receitaPrevista?: number;
  despesa: number;
  lucro: number;
}

export function FinancialSummary({ receita, receitaPrevista = 0, despesa, lucro }: FinancialSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Receita Bruta */}
      <div className="bg-surface border border-border p-6 rounded-xl flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-success">payments</span>
          </div>
          <span className="text-sm font-medium text-text-muted">Receita Realizada</span>
        </div>
        <span className="text-3xl font-bold text-white mb-1">{formatCurrency(receita)}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-muted bg-surface-container-high px-2 py-1 rounded">A receber: {formatCurrency(receitaPrevista)}</span>
        </div>
      </div>

      {/* Despesas */}
      <div className="bg-surface border border-border p-6 rounded-xl flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-error">trending_down</span>
          </div>
          <span className="text-sm font-medium text-text-muted">Despesas</span>
        </div>
        <span className="text-3xl font-bold text-white mb-1">{formatCurrency(despesa)}</span>
        <span className="text-xs text-text-muted">No período selecionado</span>
      </div>

      {/* Lucro Líquido */}
      <div className="bg-surface border border-border p-6 rounded-xl flex flex-col shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
          </div>
          <span className="text-sm font-medium text-text-muted">Lucro Líquido</span>
        </div>
        <span className="text-3xl font-bold text-primary mb-1 relative z-10">{formatCurrency(lucro)}</span>
        <span className="text-xs text-text-muted relative z-10">Receita - Despesas</span>
      </div>
    </div>
  )
}
