export default function AgendaMini() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-bright transition-colors flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-on-surface">Agenda Hoje</h2>
        <button className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-2">
          Ver Completa <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Time Block 1 */}
        <div className="flex gap-4 items-start group">
          <div className="w-16 text-right pt-1">
            <span className="text-sm font-medium text-text-muted">09:00</span>
          </div>
          <div className="flex-1 bg-surface-container-high border border-border rounded-lg p-4 group-hover:border-primary transition-colors flex justify-between items-center">
            <div>
              <h3 className="text-base text-on-surface font-medium">Reunião de Alinhamento - Q3</h3>
              <p className="text-[13px] text-text-muted">Com: Equipe de Produto</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-sm">videocam</span>
            </div>
          </div>
        </div>

        {/* Time Block 2 */}
        <div className="flex gap-4 items-start group">
          <div className="w-16 text-right pt-1">
            <span className="text-sm font-medium text-text-muted">11:30</span>
          </div>
          <div className="flex-1 bg-surface-container-high border border-border rounded-lg p-4 group-hover:border-primary transition-colors flex justify-between items-center">
            <div>
              <h3 className="text-base text-on-surface font-medium">Revisão de Design System</h3>
              <p className="text-[13px] text-text-muted">Com: Carlos S.</p>
            </div>
            <span className="chip px-2 py-0.5 rounded text-[11px] font-bold text-primary">Em 30 min</span>
          </div>
        </div>

        {/* Time Block 3 */}
        <div className="flex gap-4 items-start group opacity-50">
          <div className="w-16 text-right pt-1">
            <span className="text-sm font-medium text-text-muted">14:00</span>
          </div>
          <div className="flex-1 bg-background border border-border border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
            <span className="text-sm font-medium text-text-muted">+ Adicionar Bloco</span>
          </div>
        </div>
      </div>
    </div>
  );
}
