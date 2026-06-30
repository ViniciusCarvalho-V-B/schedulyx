'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateAppointment, deleteAppointment } from '@/app/actions/appointment'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'

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
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateAppointment(appointment.id, formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setError(null)
    setIsDeleting(true)
    
    const result = await deleteAppointment(appointment.id)
    
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-container-low">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
            Editar Agendamento
          </h3>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {error && (
            <div className="bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-muted">Serviço</label>
            <input 
              type="text" 
              name="service_name" 
              required
              defaultValue={appointment.service_name}
              placeholder="Ex: Consultoria Técnica"
              className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Data</label>
              <input 
                type="date" 
                name="date" 
                required
                defaultValue={appointment.date}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Horário</label>
              <input 
                type="time" 
                name="time" 
                required
                defaultValue={appointment.time}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Valor (R$)</label>
              <input 
                type="number" 
                name="price" 
                step="0.01"
                required
                defaultValue={appointment.price}
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted">Status</label>
              <select 
                name="status"
                defaultValue={appointment.status}
                className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting || loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading || isDeleting}
                className="bg-primary-container hover:bg-inverse-primary disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                {loading ? 'Salvando...' : 'Salvar'}
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
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar Agendamento"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
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
