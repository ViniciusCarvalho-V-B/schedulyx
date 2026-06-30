'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateTransaction, deleteTransaction } from '@/app/actions/finance'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { toast } from 'sonner'
import { Edit2, X, FileText, DollarSign, ArrowRightLeft, CheckCircle2, Trash2 } from 'lucide-react'

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  category?: string;
  transaction_date?: string;
}

export function EditTransactionModal({ transaction }: { transaction: Transaction }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const initialType = transaction.type === 'entrada' ? 'income' : transaction.type === 'saida' ? 'expense' : transaction.type
  const [transactionType, setTransactionType] = useState(initialType)
  const [status, setStatus] = useState(transaction.status)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    
    // Inject state overrides
    formData.append('type', transactionType)
    formData.append('status', status)
    
    const result = await updateTransaction(transaction.id, formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsPending(false)
    } else {
      toast.success('Transação atualizada com sucesso!')
      setIsOpen(false)
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteTransaction(transaction.id)
    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
      setShowConfirm(false)
    } else {
      toast.success('Transação excluída.')
      setIsOpen(false)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const statusOptions = transactionType === 'income' 
    ? [{ value: 'pago', label: 'Recebido' }, { value: 'pendente', label: 'A Receber' }]
    : [{ value: 'pago', label: 'Pago' }, { value: 'pendente', label: 'A Pagar' }]

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <main className="relative z-[110] w-full max-w-md bg-surface border border-primary/20 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
        
        {/* Modal Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-primary/20 bg-surface">
          <div className="flex items-center gap-3">
            <Edit2 className="w-5 h-5 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">Editar Transação</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body */}
        <form ref={formRef} action={handleSubmit} id={`edit-form-${transaction.id}`} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          
          {/* Field Group: Description */}
          <div className="bg-surface-container-lowest border border-primary/20 rounded-xl p-4 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <FileText className="w-4 h-4" />
              Descrição
            </label>
            <input 
              name="description"
              required
              defaultValue={transaction.description}
              className="w-full bg-surface-container-low border border-primary/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm"
            />
          </div>

          {/* Field Group: Value and Type */}
          <div className="flex flex-col sm:flex-row gap-5 bg-surface-container-lowest border border-primary/20 rounded-xl p-4">
            
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <DollarSign className="w-4 h-4" />
                Valor (R$)
              </label>
              <input 
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={transaction.amount}
                className="w-full bg-surface-container-low border border-primary/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm"
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <ArrowRightLeft className="w-4 h-4" />
                Tipo
              </label>
              <div className="relative">
                <select 
                  name="type_dummy" // the real type is injected via state
                  value={transactionType}
                  onChange={(e) => {
                    setTransactionType(e.target.value)
                    setStatus('pago') // reset status on type change
                  }}
                  className="appearance-none w-full bg-surface-container-low border border-primary/50 text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          {/* Field Group: Status */}
          <div className="bg-surface-container-lowest border border-primary/20 rounded-xl p-4 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <CheckCircle2 className="w-4 h-4" />
              Status
            </label>
            <div className="relative">
              <select 
                name="status_dummy" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none w-full bg-surface-container-low border border-primary/50 text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <footer className="px-6 py-5 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest/30">
          <button 
            type="button" 
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting || isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-error/20 text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-1 focus:ring-error text-sm font-medium disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-primary/20 text-text-muted hover:text-white hover:bg-surface-container transition-colors focus:outline-none focus:ring-1 focus:ring-outline text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form={`edit-form-${transaction.id}`}
              disabled={isPending || isDeleting}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface text-sm font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </footer>
      </main>
    </div>
  ) : null

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar Transação"
      >
        <Edit2 className="w-4 h-4" />
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

function ChevronDown(props: any) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
