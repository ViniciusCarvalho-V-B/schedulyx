'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createTransaction } from '@/app/actions/finance'

export function TransactionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [mounted, setMounted] = useState(false)
  const [transactionType, setTransactionType] = useState('income')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsPending(true)
    
    const result = await createTransaction(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      formRef.current?.reset()
    }
  }

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            Nova Transação
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form ref={formRef} action={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-muted">Descrição</label>
            <input 
              name="description"
              required
              className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              placeholder="Ex: Consulta João, Conta de Luz"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Valor (R$)</label>
              <input 
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                placeholder="150.00"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted mb-1 block">Tipo</label>
              <select
                name="type"
                required
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-muted">Status</label>
            <select 
              name="status" 
              className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            >
              {transactionType === 'income' ? (
                <>
                  <option value="pago">Recebido</option>
                  <option value="pendente">A Receber</option>
                </>
              ) : (
                <>
                  <option value="pago">Pago</option>
                  <option value="pendente">A Pagar</option>
                </>
              )}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-surface-container-lowest transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? 'Lançando...' : 'Criar Transação'}
            </button>
          </div>
        </form>
      </div>
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
