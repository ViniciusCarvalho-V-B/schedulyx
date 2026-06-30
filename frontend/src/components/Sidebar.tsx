export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col bg-surface border-r border-border z-50">
      <div className="px-6 py-6 flex items-center gap-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            calendar_today
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-on-surface">Schedulyx</h1>
          <p className="text-xs text-text-muted">ERP Unified</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {/* Active Tab */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-container-highest text-primary font-bold border-r-2 border-primary transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </a>

        {/* Inactive Tabs */}
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted text-sm hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Agenda</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted text-sm hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">view_kanban</span>
          <span>Kanban</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted text-sm hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">payments</span>
          <span>Financeiro</span>
        </a>
      </nav>

      <div className="px-3 pb-6 border-t border-border pt-4 space-y-1">
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted text-sm hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">account_circle</span>
          <span>Profile</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted text-sm hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}
