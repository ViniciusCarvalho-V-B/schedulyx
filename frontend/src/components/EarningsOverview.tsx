export default function EarningsOverview() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-on-surface">Visão Geral de Ganhos</h2>
        <button className="material-symbols-outlined text-text-muted hover:text-on-surface transition-colors">more_horiz</button>
      </div>
      
      {/* Mini Chart Area */}
      <div className="h-40 w-full mb-6 rounded-lg bg-surface-container-low border border-border flex items-end px-2 py-2 gap-1 relative overflow-hidden">
        <div className="w-full h-full absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background"></div>
        {/* Bars */}
        <div className="w-1/6 bg-border h-1/3 rounded-t-sm relative z-10"></div>
        <div className="w-1/6 bg-border h-1/2 rounded-t-sm relative z-10"></div>
        <div className="w-1/6 bg-border h-2/5 rounded-t-sm relative z-10"></div>
        <div className="w-1/6 bg-primary h-4/5 rounded-t-sm relative z-10 opacity-80"></div>
        <div className="w-1/6 bg-border h-2/3 rounded-t-sm relative z-10"></div>
        <div className="w-1/6 bg-border h-1/4 rounded-t-sm relative z-10"></div>
      </div>
      
      <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Transações Recentes</h3>
      
      <div className="space-y-4">
        {/* Transaction 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-surface-container-high border border-border flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">arrow_downward</span>
            </div>
            <div>
              <p className="text-sm text-on-surface font-medium">Consultoria Técnica</p>
              <p className="text-[12px] font-medium text-text-muted">Hoje, 10:45</p>
            </div>
          </div>
          <span className="text-sm text-on-surface font-medium">+ R$ 1.250,00</span>
        </div>

        {/* Transaction 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-surface-container-high border border-border flex items-center justify-center">
              <span className="material-symbols-outlined text-text-muted text-sm">arrow_upward</span>
            </div>
            <div>
              <p className="text-sm text-on-surface font-medium">Assinatura AWS</p>
              <p className="text-[12px] font-medium text-text-muted">Ontem, 14:20</p>
            </div>
          </div>
          <span className="text-sm text-text-muted font-medium">- R$ 340,00</span>
        </div>

        {/* Transaction 3 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-surface-container-high border border-border flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">arrow_downward</span>
            </div>
            <div>
              <p className="text-sm text-on-surface font-medium">Projeto UX/UI App</p>
              <p className="text-[12px] font-medium text-text-muted">22 Ago, 09:15</p>
            </div>
          </div>
          <span className="text-sm text-on-surface font-medium">+ R$ 4.500,00</span>
        </div>
      </div>
      
      <button className="w-full mt-6 btn-secondary py-2 text-sm font-medium hover:bg-surface-container-high transition-colors">
        Ver Relatório Completo
      </button>
    </div>
  );
}
