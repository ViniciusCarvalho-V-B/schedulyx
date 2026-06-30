'use client'

import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  isDeleting = false 
}: ConfirmDeleteModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isDeleting ? undefined : onClose}
      />
      
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[24px] text-error">warning</span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-text-muted mb-6">{description}</p>
          
          <div className="flex w-full gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-surface-container-low hover:bg-surface-container-high text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-error hover:bg-error/90 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
