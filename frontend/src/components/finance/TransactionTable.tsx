interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'entrada' | 'saida';
  date: string;
}

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">Extrato Recente</h3>
      </div>
      
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-container-lowest border-b border-border text-text-muted">
          <tr>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Data</th>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Descrição</th>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Tipo</th>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px] text-right">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center text-text-muted text-sm">
                <span className="material-symbols-outlined text-[32px] text-border-bright block mb-3 opacity-50">receipt_long</span>
                Nenhuma transação financeira registrada.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4 text-text-muted whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="px-6 py-4 text-white font-medium">{tx.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    tx.type === 'entrada' 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-error/10 text-error border-error/20'
                  }`}>
                    {tx.type === 'entrada' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold text-right ${
                  tx.type === 'entrada' ? 'text-success' : 'text-error'
                }`}>
                  {tx.type === 'entrada' ? '+' : '-'} {formatCurrency(tx.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
