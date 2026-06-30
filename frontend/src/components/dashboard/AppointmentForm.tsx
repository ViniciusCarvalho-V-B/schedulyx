'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createAppointment } from '@/app/actions/appointment'
import { toast } from 'sonner'
import { X, CalendarIcon, HelpCircle, ChevronDown } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

export function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const [date, setDate] = useState<Date>()
  const [status, setStatus] = useState('pendente')
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    if (!date) {
      toast.error("Por favor, selecione uma data.")
      setLoading(false)
      return
    }
    
    const formData = new FormData(e.currentTarget)
    formData.append('date', format(date, 'yyyy-MM-dd'))
    formData.append('status', status)
    
    const result = await createAppointment(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Agendamento criado com sucesso!")
      setIsOpen(false)
      setLoading(false)
      formRef.current?.reset()
      setDate(undefined)
      setStatus('pendente')
    }
  }

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'completed', label: 'Concluído' }
  ]
  const currentStatusLabel = statusOptions.find(o => o.value === status)?.label || 'Selecione'

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer Slide-over Panel */}
      <aside className="fixed inset-y-0 right-0 z-[110] flex max-w-full w-[480px] animate-in slide-in-from-right duration-300">
        <div className="w-full flex flex-col bg-surface shadow-2xl border-l border-outline-variant h-full overflow-hidden">
          
          {/* Drawer Header */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface shrink-0">
            <h2 className="text-xl font-semibold text-white tracking-tight">Novo Agendamento</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-white rounded-md p-1.5 hover:bg-surface-container transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto drawer-scroll relative p-6">
            <style>{`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: #4f46e5;
                --rdp-background-color: #1d2021;
                --rdp-accent-color-dark: #4f46e5;
                --rdp-background-color-dark: #1d2021;
                --rdp-outline: 2px solid var(--rdp-accent-color);
                margin: 0;
              }
              .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                background-color: var(--rdp-accent-color);
                color: white;
              }
              .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                background-color: #2b2e2f;
              }
            `}</style>
            
            <form id="appointment-form" onSubmit={handleSubmit} className="space-y-8 pb-8">
              
              {/* Section: Detalhes do Serviço */}
              <section>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Detalhes do Serviço</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5" htmlFor="service_name">Nome do Serviço</label>
                    <input 
                      name="service_name" 
                      id="service_name" 
                      required
                      className="custom-input block w-full rounded-xl border border-outline-variant/30 bg-surface-container-low text-white placeholder:text-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors py-2.5 px-3" 
                      placeholder="Ex: Consultoria de Vendas" 
                      type="text"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Valores */}
              <section>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Valor do Serviço</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5" htmlFor="price">Valor (R$)</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-text-muted sm:text-sm">R$</span>
                      </div>
                      <input 
                        name="price" 
                        id="price" 
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="custom-input block w-full rounded-xl border border-outline-variant/30 bg-surface-container-low text-white placeholder:text-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-9 transition-colors py-2.5 pr-3" 
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Data e Status */}
              <section>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Data e Status</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Data</label>
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <button
                            type="button"
                            className="custom-input flex w-full items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-low text-white focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors py-2.5 px-3"
                          >
                            <span>{date ? format(date, 'dd/MM/yyyy') : 'Selecionar'}</span>
                            <CalendarIcon className="h-4 w-4 text-text-muted" />
                          </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content className="z-[120] bg-surface-container border border-outline-variant/30 rounded-xl p-3 shadow-xl text-white">
                            <DayPicker
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              locale={ptBR}
                              className="text-sm"
                            />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5" htmlFor="time">Horário</label>
                      <div className="relative">
                        <input 
                          name="time" 
                          id="time" 
                          type="time"
                          required
                          className="custom-input block w-full rounded-xl border border-outline-variant/30 bg-surface-container-low text-white focus:ring-1 focus:ring-primary sm:text-sm transition-colors py-2.5 px-3 [color-scheme:dark]" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Custom Select for Status */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-white">Status</label>
                      <HelpCircle className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                        className="custom-input relative w-full cursor-default rounded-xl border border-outline-variant/30 bg-surface-container-low py-2.5 pl-3 pr-10 text-left text-white focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                      >
                        <span className="block truncate">{currentStatusLabel}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="w-5 h-5 text-text-muted" />
                        </span>
                      </button>
                      
                      {statusDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)}></div>
                          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-surface-container-high py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-outline-variant/30">
                            {statusOptions.map((opt) => (
                              <li 
                                key={opt.value}
                                onClick={() => { setStatus(opt.value); setStatusDropdownOpen(false); }}
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-surface-container-highest transition-colors ${
                                  status === opt.value ? 'bg-surface-container-highest/50 text-white font-medium' : 'text-text-muted'
                                }`}
                              >
                                <span className="block truncate">{opt.label}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </section>
            </form>
          </div>

          {/* Drawer Footer */}
          <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface shrink-0">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-outline-variant/50 bg-transparent px-4 py-2.5 text-sm font-medium text-white hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form="appointment-form"
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Agendar'}
            </button>
          </footer>
        </div>
      </aside>
    </div>
  ) : null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Novo Agendamento
      </button>
      
      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}
