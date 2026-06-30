'use client'

import { useState } from 'react'
import { createAppointment } from '@/app/actions/appointment'

export function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await createAppointment(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setIsOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary-container hover:bg-inverse-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Novo Agendamento
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-container-low">
              <h3 className="text-lg font-semibold text-white">Novo Agendamento</h3>
              <button 
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
                    className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text-muted">Horário</label>
                  <input 
                    type="time" 
                    name="time" 
                    required
                    className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text-muted">Valor (R$)</label>
                <input 
                  type="number" 
                  name="price" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-primary-container hover:bg-inverse-primary disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  {loading ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}
