'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/components/PasswordInput'
import { signUpWithPassword } from '@/app/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<string | null>(null)

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setErrorState(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setErrorState("As senhas não coincidem. Tente novamente.")
      setIsLoading(false)
      return
    }
    
    try {
      const result = await signUpWithPassword(formData)
      if (result.error) {
        setErrorState(result.error)
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setErrorState("Erro inesperado ao cadastrar.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden flex selection:bg-primary-container selection:text-white">
      {/* Left Column: Brand Presentation */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-10 border-r border-border bg-background relative" 
           style={{
             backgroundImage: "radial-gradient(circle at 1px 1px, rgba(30, 41, 59, 0.5) 1px, transparent 0)",
             backgroundSize: "24px 24px"
           }}>
        
        {/* Top: Logo */}
        <div className="flex items-center gap-3 z-10">
          <svg fill="none" height="40" viewBox="0 0 40 40" width="40" xmlns="http://www.w3.org/2000/svg">
            <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="8" y="8" />
            <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="16" y="16" />
            <rect fill="#d97707" height="8" rx="1" style={{ filter: "drop-shadow(0px 0px 8px rgba(217,119,7,0.6))" }} width="8" x="16" y="16" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-white">schedulyx</span>
        </div>
        
        {/* Center: Copy */}
        <div className="z-10 max-w-md">
          <h1 className="text-5xl font-bold text-white mb-8 leading-tight">O primeiro passo para o controle total.</h1>
          <p className="text-base text-text-muted">
            Crie sua conta administrativa e tenha acesso imediato ao ecossistema Schedulyx. Agendamento, Kanban e Financeiro em um só lugar.
          </p>
        </div>
        
        {/* Footer: Badges */}
        <div className="z-10 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-container-low/50 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <span className="text-[11px] font-bold text-text-muted uppercase">Acesso Seguro LGPD</span>
          </div>
        </div>
      </div>

      {/* Right Column: Register */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#0c0f10]">
        
        {/* Floating Card */}
        <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-8 transition-all duration-300 ease-in-out">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 justify-center mb-2">
            <svg fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
              <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="8" y="8" />
              <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="16" y="16" />
              <rect fill="#d97707" height="8" rx="1" width="8" x="16" y="16" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">schedulyx</span>
          </div>

          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Criar conta Administrador</h2>
            <p className="text-sm text-text-muted">Preencha os dados para iniciar o setup do seu ERP</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleRegister}>
            
            {errorState && (
              <div className="bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg flex justify-between items-start gap-3">
                <span className="flex-1">{errorState}</span>
                <button type="button" onClick={() => setErrorState(null)} className="material-symbols-outlined text-[18px] opacity-70 hover:opacity-100 transition-opacity">close</button>
              </div>
            )}

            {/* Nome Completo */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="fullName">Nome Completo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">person</span>
                <input 
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all duration-300 ease-in-out" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Seu nome" 
                  required 
                  type="text" 
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="email">Email Corporativo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">mail</span>
                <input 
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all duration-300 ease-in-out" 
                  id="email" 
                  name="email" 
                  placeholder="nome@empresa.com" 
                  required 
                  type="email" 
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="password">Senha Segura</label>
              <div className={`transition-all duration-300 ease-in-out ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                <PasswordInput />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="confirmPassword">Confirmação de Senha</label>
              <div className={`transition-all duration-300 ease-in-out ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">lock</span>
                  <input 
                    className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all duration-300 ease-in-out" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full btn-primary hover:bg-inverse-primary text-white text-sm font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Criando infraestrutura...
                </>
              ) : (
                <>
                  Finalizar Cadastro
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
            
            {/* Login Link */}
            <div className="text-center text-text-muted text-sm mt-[-8px]">
              Já tem uma conta? <Link href="/login" className="text-indigo-500 hover:text-indigo-400 hover:underline font-bold cursor-pointer transition-all duration-300 ease-in-out">Entre aqui</Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
