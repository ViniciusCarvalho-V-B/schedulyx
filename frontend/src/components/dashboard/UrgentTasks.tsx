export default function UrgentTasks() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">priority_high</span>
          Tarefas Urgentes
        </h2>
      </div>
      
      <div className="space-y-0">
        {/* Task Row 1 */}
        <div className="flex items-center justify-between py-3 border-b border-border hover:bg-border/50 transition-colors px-2 rounded-t-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded border border-text-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors"></div>
            <span className="text-sm text-on-surface">Finalizar fluxo de pagamento (Stripe)</span>
          </div>
          <span className="chip-urgent px-2 py-0.5 rounded text-[11px] font-bold text-secondary-container">Em Andamento</span>
        </div>

        {/* Task Row 2 */}
        <div className="flex items-center justify-between py-3 border-b border-border hover:bg-border/50 transition-colors px-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded border border-text-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors"></div>
            <span className="text-sm text-on-surface">Corrigir bug de timezone na Agenda</span>
          </div>
          <span className="chip px-2 py-0.5 rounded text-[11px] font-bold text-primary">Para Fazer</span>
        </div>

        {/* Task Row 3 */}
        <div className="flex items-center justify-between py-3 hover:bg-border/50 transition-colors px-2 rounded-b-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded border border-text-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors"></div>
            <span className="text-sm text-on-surface">Revisar relatórios financeiros de Abril</span>
          </div>
          <span className="chip-urgent px-2 py-0.5 rounded text-[11px] font-bold text-secondary-container">Atrasado</span>
        </div>
      </div>
    </div>
  );
}
