'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'geral' | 'notificacoes' | 'conta'

interface Tab {
  id: TabId
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'geral', label: 'Geral', icon: 'tune' },
  { id: 'notificacoes', label: 'Notificações', icon: 'notifications' },
  { id: 'conta', label: 'Conta', icon: 'person' },
]

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onToggle,
  id,
}: {
  enabled: boolean
  onToggle: () => void
  id: string
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
        border transition-colors duration-200 ease-in-out focus:outline-none
        focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        ${enabled
          ? 'bg-primary border-primary'
          : 'bg-surface-container-high border-border'
        }
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full
          bg-white shadow-sm ring-0 transition duration-200 ease-in-out
          mt-[3px]
          ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}
        `}
      />
    </button>
  )
}

// ─── Reusable Select ──────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5
            text-sm text-on-surface appearance-none cursor-pointer
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-lg">
          expand_more
        </span>
      </div>
    </div>
  )
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({
  id,
  title,
  description,
  enabled,
  onToggle,
}: {
  id: string
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-on-surface cursor-pointer">
          {title}
        </label>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} id={id} />
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface border border-border rounded-lg p-5 sm:p-6">
      <div className="mb-5 border-b border-border pb-3">
        <h3 className="text-base font-semibold text-on-surface">{title}</h3>
        <p className="text-sm text-text-muted mt-0.5">{description}</p>
      </div>
      {children}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Page ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('geral')

  // ── Geral state ─────────────────────────────────────────────────────────
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [timeFormat, setTimeFormat] = useState('24h')
  const [language, setLanguage] = useState('pt-BR')
  const [weekStart, setWeekStart] = useState('segunda')

  // ── Notificações state ──────────────────────────────────────────────────
  const [notifyNewAppointment, setNotifyNewAppointment] = useState(true)
  const [notifyReminder, setNotifyReminder] = useState(true)
  const [notifyCancellation, setNotifyCancellation] = useState(true)
  const [notifyReschedule, setNotifyReschedule] = useState(true)
  const [notifyDailySummary, setNotifyDailySummary] = useState(false)
  const [reminderTime, setReminderTime] = useState('30')

  // ── Conta state ─────────────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const handleSave = () => {
    // TODO: persist to Supabase
    alert('Configurações salvas com sucesso!')
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 sm:p-8 pb-32 md:pb-8 relative z-0">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-1">
          Configurações
        </h2>
        <p className="text-sm text-text-muted">
          Gerencie suas preferências de agendamento, notificações e conta.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Tab Navigation ─────────────────────────────────────────── */}
        <nav className="w-full lg:w-52 flex-shrink-0 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-lg
                  text-sm font-medium whitespace-nowrap lg:whitespace-normal
                  transition-all duration-150
                  ${isActive
                    ? 'bg-primary-container text-on-primary-container border border-primary/30'
                    : 'text-text-muted hover:text-on-surface hover:bg-surface-container-high border border-transparent'
                  }
                `}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : ''}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* ── Tab Content ────────────────────────────────────────────── */}
        <div className="flex-1 max-w-3xl w-full flex flex-col gap-6 animate-fade-in">

          {/* ═════════════════ TAB: GERAL ═════════════════ */}
          {activeTab === 'geral' && (
            <>
              <SectionCard
                title="Regional"
                description="Configurações de localização, fuso horário e formato de exibição."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField
                    label="Fuso Horário"
                    value={timezone}
                    onChange={setTimezone}
                    options={[
                      { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
                      { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
                      { value: 'America/Belem', label: 'Belém (GMT-3)' },
                      { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
                      { value: 'America/Recife', label: 'Recife (GMT-3)' },
                      { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
                      { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
                      { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
                    ]}
                  />
                  <SelectField
                    label="Formato de Data"
                    value={dateFormat}
                    onChange={setDateFormat}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA' },
                      { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD' },
                    ]}
                  />
                  <SelectField
                    label="Formato de Hora"
                    value={timeFormat}
                    onChange={setTimeFormat}
                    options={[
                      { value: '24h', label: '24 horas (14:30)' },
                      { value: '12h', label: '12 horas (2:30 PM)' },
                    ]}
                  />
                  <SelectField
                    label="Idioma"
                    value={language}
                    onChange={setLanguage}
                    options={[
                      { value: 'pt-BR', label: 'Português (Brasil)' },
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Español' },
                    ]}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Agenda"
                description="Preferências para a exibição do seu calendário."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField
                    label="Início da Semana"
                    value={weekStart}
                    onChange={setWeekStart}
                    options={[
                      { value: 'segunda', label: 'Segunda-feira' },
                      { value: 'domingo', label: 'Domingo' },
                      { value: 'sabado', label: 'Sábado' },
                    ]}
                  />
                  <SelectField
                    label="Duração Padrão do Agendamento"
                    value="60"
                    onChange={() => {}}
                    options={[
                      { value: '15', label: '15 minutos' },
                      { value: '30', label: '30 minutos' },
                      { value: '45', label: '45 minutos' },
                      { value: '60', label: '1 hora' },
                      { value: '90', label: '1h 30min' },
                      { value: '120', label: '2 horas' },
                    ]}
                  />
                </div>
              </SectionCard>
            </>
          )}

          {/* ═════════════════ TAB: NOTIFICAÇÕES ═════════════════ */}
          {activeTab === 'notificacoes' && (
            <>
              <SectionCard
                title="Notificações por E-mail"
                description="Escolha quais eventos geram notificações por e-mail."
              >
                <div className="flex flex-col">
                  <ToggleRow
                    id="notify-new"
                    title="Novo agendamento"
                    description="Receber um e-mail quando um cliente criar um novo agendamento."
                    enabled={notifyNewAppointment}
                    onToggle={() => setNotifyNewAppointment(!notifyNewAppointment)}
                  />
                  <ToggleRow
                    id="notify-cancel"
                    title="Cancelamento"
                    description="Receber um e-mail quando um agendamento for cancelado."
                    enabled={notifyCancellation}
                    onToggle={() => setNotifyCancellation(!notifyCancellation)}
                  />
                  <ToggleRow
                    id="notify-reschedule"
                    title="Reagendamento"
                    description="Receber um e-mail quando um cliente reagendar um horário."
                    enabled={notifyReschedule}
                    onToggle={() => setNotifyReschedule(!notifyReschedule)}
                  />
                  <ToggleRow
                    id="notify-summary"
                    title="Resumo diário"
                    description="Receber um resumo dos agendamentos do dia seguinte, toda noite."
                    enabled={notifyDailySummary}
                    onToggle={() => setNotifyDailySummary(!notifyDailySummary)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Lembretes"
                description="Configure os lembretes enviados aos seus clientes."
              >
                <div className="flex flex-col">
                  <ToggleRow
                    id="notify-reminder"
                    title="Lembrete antes do horário"
                    description="Enviar lembrete automático por e-mail antes do agendamento."
                    enabled={notifyReminder}
                    onToggle={() => setNotifyReminder(!notifyReminder)}
                  />
                  {notifyReminder && (
                    <div className="py-4 pl-1">
                      <SelectField
                        label="Antecedência do Lembrete"
                        value={reminderTime}
                        onChange={setReminderTime}
                        options={[
                          { value: '15', label: '15 minutos antes' },
                          { value: '30', label: '30 minutos antes' },
                          { value: '60', label: '1 hora antes' },
                          { value: '120', label: '2 horas antes' },
                          { value: '1440', label: '1 dia antes' },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </SectionCard>
            </>
          )}

          {/* ═════════════════ TAB: CONTA ═════════════════ */}
          {activeTab === 'conta' && (
            <>
              <SectionCard
                title="Segurança"
                description="Gerencie a segurança da sua conta."
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface">Alterar senha</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Atualize sua senha de acesso periodicamente.
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-border text-sm text-on-surface hover:bg-surface-container-high transition-colors">
                      Alterar
                    </button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-on-surface">Sessões ativas</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Veja e encerre sessões em outros dispositivos.
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-border text-sm text-on-surface hover:bg-surface-container-high transition-colors">
                      Gerenciar
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Exportar Dados"
                description="Baixe uma cópia dos seus dados de agendamento."
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Exportar agendamentos</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Gera um arquivo CSV com todos os seus agendamentos e transações.
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">download</span>
                    Exportar
                  </button>
                </div>
              </SectionCard>

              {/* Danger Zone */}
              <section className="bg-surface border border-error/30 rounded-lg p-5 sm:p-6">
                <div className="mb-5 border-b border-error/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-xl">warning</span>
                    <h3 className="text-base font-semibold text-error">Zona de Perigo</h3>
                  </div>
                  <p className="text-sm text-text-muted mt-0.5">
                    Ações irreversíveis. Proceda com cautela.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-on-surface font-medium">Excluir conta</p>
                  <p className="text-xs text-text-muted mt-0.5 mb-4">
                    Ao excluir sua conta, todos os seus dados serão permanentemente
                    removidos — agendamentos, clientes, transações e configurações.
                    Essa ação não pode ser desfeita.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    <div className="flex-1 w-full sm:max-w-xs">
                      <label className="block text-xs text-text-muted mb-1.5">
                        Digite <span className="font-mono text-error font-semibold">EXCLUIR</span> para confirmar
                      </label>
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="EXCLUIR"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5
                          text-sm text-on-surface placeholder:text-text-muted/50
                          focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20
                          transition-all"
                      />
                    </div>
                    <button
                      disabled={deleteConfirm !== 'EXCLUIR'}
                      className="px-4 py-2.5 rounded-lg bg-error/10 border border-error/30 text-error
                        text-sm font-medium transition-all
                        hover:bg-error hover:text-white hover:border-error
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-error/10
                        disabled:hover:text-error disabled:hover:border-error/30"
                    >
                      Excluir minha conta
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── Save Button (shown on Geral and Notificações tabs) ─── */}
          {activeTab !== 'conta' && (
            <div className="flex justify-end gap-3 pt-2 pb-4">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium
                  hover:bg-inverse-primary transition-colors shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  focus:ring-offset-background"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
