export function TransactionTable() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">Extrato Recente</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todas
        </button>
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
          {/* Skeleton state de ausência de dados, já preparado com estilo limpo */}
          <tr>
            <td colSpan={4} className="px-6 py-16 text-center text-text-muted text-sm">
              <span className="material-symbols-outlined text-[32px] text-border-bright block mb-3 opacity-50">receipt_long</span>
              Nenhuma transação financeira registrada.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
