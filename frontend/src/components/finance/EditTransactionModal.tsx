'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateTransaction, deleteTransaction } from '@/app/actions/finance'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

export function EditTransactionModal({ transaction }: { transaction: Transaction }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsPending(true)
    
    const result = await updateTransaction(transaction.id, formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    setError(null)
    setIsDeleting(true)
    
    const result = await deleteTransaction(transaction.id)
    
    if (result?.error) {
      setError(result.error)
      setIsDeleting(false)
      setShowConfirm(false)
    } else {
      setIsOpen(false)
      setIsDeleting(false)
      setShowConfirm(false)
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
            <span className="material-symbols-outlined text-[24px]">edit</span>
            Editar Transação
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
              defaultValue={transaction.description}
              className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
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
                defaultValue={transaction.amount}
                className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Tipo</label>
              <select 
                name="type" 
                defaultValue={transaction.type}
                className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              >
                <option value="entrada">Ganho / Entrada</option>
                <option value="saida">Despesa / Saída</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-muted">Status</label>
            <select 
              name="status" 
              defaultValue={transaction.status}
              className="bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            >
              <option value="pago">Pago / Recebido</option>
              <option value="pendente">Pendente / A Receber</option>
            </select>
          </div>

          <div className="pt-2 flex justify-between items-center mt-2">
            <button 
              type="button" 
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting || isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending || isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-surface-container-lowest transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar Transação"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </button>
      
      {mounted && createPortal(modalContent, document.body)}

      <ConfirmDeleteModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Excluir Transação"
        description="Tem certeza que deseja excluir permanentemente esta transação financeira?"
        isDeleting={isDeleting}
      />
    </>
  )
}
