'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createTransaction } from '@/app/actions/finance'
import { toast } from 'sonner'
import { X, Calendar, Clock, HelpCircle, ChevronDown } from 'lucide-react'

export function TransactionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income')
  const [status, setStatus] = useState('pago')
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    
    // Inject custom state into formData
    formData.append('type', transactionType)
    formData.append('status', status)

    const result = await createTransaction(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsPending(false)
    } else {
      toast.success('Transação registrada com sucesso!')
      setIsOpen(false)
      setIsPending(false)
      formRef.current?.reset()
      setTransactionType('income')
      setStatus('pago')
    }
  }

  const statusOptions = transactionType === 'income' 
    ? [{ value: 'pago', label: 'Recebido' }, { value: 'pendente', label: 'A Receber' }]
    : [{ value: 'pago', label: 'Pago' }, { value: 'pendente', label: 'A Pagar' }]

  const currentStatusLabel = statusOptions.find(o => o.value === status)?.label || 'Selecione'

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer Slide-over Panel */}
      <aside className="fixed inset-y-0 right-0 z-[110] flex max-w-full w-[480px] animate-slide-in-right">
        <div className="w-full flex flex-col bg-surface shadow-2xl border-l border-outline-variant h-full overflow-hidden">
          {/* Drawer Header */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface shrink-0">
            <h2 className="text-xl font-semibold text-white tracking-tight">Nova Transação</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-white rounded-md p-1.5 hover:bg-surface-container transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto drawer-scroll relative p-6">
            <form ref={formRef} action={handleSubmit} id="transaction-form" className="space-y-8 pb-8">
              
              {/* Section: Detalhes da Transação */}
              <section>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Detalhes da Transação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5" htmlFor="description">Descrição</label>
                    <input 
                      name="description" 
                      id="description" 
                      required
                      className="custom-input block w-full rounded-xl border border-primary/20 bg-surface-container-low text-white placeholder:text-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors py-2.5 px-3" 
                      placeholder="Ex: Consultoria Técnica" 
                      type="text"
                    />
                  </div>
                </div>
              </section>

              {/* Section: Valores e Tipo */}
              <section>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Valores e Tipo</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5" htmlFor="amount">Valor (R$)</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-text-muted sm:text-sm">R$</span>
                      </div>
                      <input 
                        name="amount" 
                        id="amount" 
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        className="custom-input block w-full rounded-xl border border-primary/20 bg-surface-container-low text-white placeholder:text-text-muted/50 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm pl-9 transition-colors py-2.5 pr-3" 
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  {/* Segmented Control for Type */}
                  <div>
                    <span className="block text-sm font-medium text-white mb-2">Tipo</span>
                    <div className="flex rounded-xl bg-surface-container p-1 border border-primary/20">
                      <button 
                        type="button" 
                        onClick={() => { setTransactionType('income'); setStatus('pago'); }}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                          transactionType === 'income' 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'text-text-muted hover:text-white hover:bg-surface-container-high'
                        }`}
                      >
                        Receita
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setTransactionType('expense'); setStatus('pago'); }}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                          transactionType === 'expense' 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'text-text-muted hover:text-white hover:bg-surface-container-high'
                        }`}
                      >
                        Despesa
                      </button>
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
                      <label className="block text-sm font-medium text-white mb-1.5" htmlFor="data">Data</label>
                      <div className="relative">
                        <input 
                          name="data" 
                          id="data" 
                          type="date"
                          className="custom-input block w-full rounded-xl border border-primary/20 bg-surface-container-low text-white focus:ring-1 focus:ring-primary sm:text-sm transition-colors py-2.5 px-3 [color-scheme:dark]" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5" htmlFor="hora">Hora</label>
                      <div className="relative">
                        <input 
                          name="hora" 
                          id="hora" 
                          type="time"
                          className="custom-input block w-full rounded-xl border border-primary/20 bg-surface-container-low text-white focus:ring-1 focus:ring-primary sm:text-sm transition-colors py-2.5 px-3 [color-scheme:dark]" 
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
                        className="custom-input relative w-full cursor-default rounded-xl border border-primary/20 bg-surface-container-low py-2.5 pl-3 pr-10 text-left text-white focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                      >
                        <span className="block truncate">{currentStatusLabel}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="w-5 h-5 text-text-muted" />
                        </span>
                      </button>
                      
                      {statusDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)}></div>
                          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-surface-container-high py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-primary/20">
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

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5" htmlFor="category">Categoria</label>
                    <select 
                      name="category" 
                      id="category"
                      className="custom-input block w-full rounded-xl border border-primary/20 bg-surface-container-low text-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors py-2.5 px-3"
                    >
                      <option value="">Selecione...</option>
                      <option value="servicos">Serviços</option>
                      <option value="produtos">Produtos</option>
                      <option value="impostos">Impostos</option>
                      <option value="outros">Outros</option>
                    </select>
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
              className="rounded-xl border border-primary/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form="transaction-form"
              disabled={isPending}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {isPending ? 'Criando...' : 'Criar Transação'}
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
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-surface-container-lowest text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Nova Transação
      </button>
      
      {mounted && createPortal(modalContent, document.body)}
    </>
  )
}
