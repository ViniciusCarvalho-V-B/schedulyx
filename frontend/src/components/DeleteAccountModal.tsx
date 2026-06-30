'use client'

import { useState } from 'react'
import { deleteUserAccount } from '@/app/actions/lgpd'

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    const result = await deleteUserAccount()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-[11px] uppercase tracking-wider text-error/70 hover:text-error hover:bg-error/10 transition-colors border border-transparent hover:border-error/20"
      >
        <span className="material-symbols-outlined text-[16px]">delete_forever</span>
        Excluir Minha Conta (LGPD)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-sm rounded-2xl border border-error/30 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px] text-error">warning</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">Excluir Conta Definitivamente?</h3>
              
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                Esta ação é <strong className="text-error font-medium">irreversível</strong>. Todos os seus dados pessoais, agendamentos, tarefas do Kanban e informações financeiras serão apagados permanentemente, de acordo com o seu direito garantido pela LGPD.
              </p>

              {error && (
                <div className="w-full bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg mb-4 text-left">
                  {error}
                </div>
              )}

              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-surface-container-high hover:bg-surface-bright text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-error hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Apagando...' : 'Sim, Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
