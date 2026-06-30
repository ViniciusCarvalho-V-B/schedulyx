'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateAppointment, deleteAppointment } from '@/app/actions/appointment'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { toast } from 'sonner'
import { Edit2, X, FileText, DollarSign, ArrowRightLeft, CalendarIcon, Clock, Trash2 } from 'lucide-react'

interface Appointment {
  id: string;
  service_name: string;
  date: string;
  time: string;
  price: number;
  status: string;
}

export function EditAppointmentModal({ appointment }: { appointment: Appointment }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [status, setStatus] = useState(appointment.status)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append('status', status)
    
    const result = await updateAppointment(appointment.id, formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Agendamento atualizado com sucesso!')
      setIsOpen(false)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAppointment(appointment.id)
    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
      setShowConfirm(false)
    } else {
      toast.success('Agendamento excluído.')
      setIsOpen(false)
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'completed', label: 'Concluído' }
  ]

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <main className="relative z-[110] w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
        
        {/* Header Modal */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <Edit2 className="w-5 h-5 text-text-muted" />
            <h2 className="text-lg font-semibold text-white">Editar Agendamento</h2>
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Form */}
        <form id={`edit-apt-form-${appointment.id}`} onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          
          <div className="bg-surface-container-low border border-border rounded-xl p-4 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <FileText className="w-4 h-4" />
              Nome do Serviço
            </label>
            <input 
              name="service_name"
              required
              defaultValue={appointment.service_name}
              className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5 bg-surface-container-low border border-border rounded-xl p-4">
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <CalendarIcon className="w-4 h-4" />
                Data
              </label>
              <input 
                name="date"
                type="date"
                required
                defaultValue={appointment.date}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm [color-scheme:dark]"
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <Clock className="w-4 h-4" />
                Horário
              </label>
              <input 
                name="time"
                type="time"
                required
                defaultValue={appointment.time}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 bg-surface-container-low border border-border rounded-xl p-4">
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <DollarSign className="w-4 h-4" />
                Valor (R$)
              </label>
              <input 
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={appointment.price}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors sm:text-sm"
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <ArrowRightLeft className="w-4 h-4" />
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
          </div>

        </form>

        {/* Modal Footer */}
        <footer className="px-6 py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low/30">
          <button 
            type="button" 
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-error/20 text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-1 focus:ring-error text-sm font-medium disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-border text-text-muted hover:text-white hover:bg-surface-container transition-colors focus:outline-none focus:ring-1 focus:ring-outline text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form={`edit-apt-form-${appointment.id}`}
              disabled={loading || isDeleting}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface text-sm font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </footer>

      </main>
    </div>
  ) : null

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar Agendamento"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {mounted && createPortal(modalContent, document.body)}
      
      <ConfirmDeleteModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Excluir Agendamento"
        description="Tem certeza que deseja excluir este agendamento? A tarefa será removida do Kanban automaticamente."
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
