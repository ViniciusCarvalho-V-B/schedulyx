'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, updateSecurity, uploadAvatar } from '@/app/actions/settings'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'

interface SettingsFormProps {
  user: any
  profile: any
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    if (type === 'success') {
      setTimeout(() => setMessage(null), 4000)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsPending(true)
    setMessage(null)

    // Pre-visualização local
    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)

    const formData = new FormData()
    formData.append('avatar', file)

    const res = await uploadAvatar(formData)
    
    setIsPending(false)
    if (res?.error) {
      showMessage('error', res.error)
      setAvatarUrl(profile?.avatar_url || null) // reverte em caso de erro
    } else {
      showMessage('success', 'Foto de perfil atualizada!')
      router.refresh() // Força a Sidebar a atualizar
    }
  }

  const handleProfileSubmit = async (formData: FormData) => {
    setIsPending(true)
    setMessage(null)
    const res = await updateProfile(formData)
    setIsPending(false)

    if (res?.error) showMessage('error', res.error)
    else {
      showMessage('success', 'Perfil atualizado com sucesso!')
      router.refresh()
    }
  }

  const handleSecuritySubmit = async (formData: FormData) => {
    setIsPending(true)
    setMessage(null)
    const res = await updateSecurity(formData)
    setIsPending(false)

    if (res?.error) showMessage('error', res.error)
    else showMessage('success', res.message || 'Segurança atualizada com sucesso!')
  }

  return (
    <div className="w-full">
      {/* Tabs Nav */}
      <div className="flex items-center gap-8 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === 'profile' ? 'text-primary' : 'text-text-muted hover:text-white'
          }`}
        >
          Perfil Público
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-4 text-sm font-medium transition-colors relative ${
            activeTab === 'security' ? 'text-primary' : 'text-text-muted hover:text-white'
          }`}
        >
          Segurança
          {activeTab === 'security' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
          )}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 border ${
          message.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      {/* Tab Content: Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6">Informações Pessoais</h2>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Avatar Uploader */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={handleAvatarClick}
                  className="w-24 h-24 rounded-full border-2 border-border bg-surface-container-high overflow-hidden cursor-pointer relative group flex items-center justify-center"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{user.email?.charAt(0).toUpperCase()}</span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden" 
                />
                <button type="button" onClick={handleAvatarClick} className="text-xs text-primary hover:underline">
                  Mudar Foto
                </button>
              </div>

              {/* Formulário de Perfil */}
              <form action={handleProfileSubmit} className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Nome Completo</label>
                  <input 
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-surface-container-lowest transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-6">Credenciais de Acesso</h2>
            
            <form action={handleSecuritySubmit} className="flex flex-col gap-5 max-w-xl">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">E-mail</label>
                <input 
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div className="border-t border-border pt-4">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Nova Senha (opcional)</label>
                <input 
                  name="newPassword"
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all mb-4"
                />
                
                <label className="text-xs font-medium text-warning uppercase tracking-wider mb-2 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Senha Atual (Obrigatória para alterações)
                </label>
                <input 
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="Sua senha atual"
                  className="w-full bg-background border border-warning/50 focus:border-warning rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-2 focus:ring-warning/20 focus:outline-none transition-all"
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover text-surface-container-lowest transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Atualizando...' : 'Atualizar Credenciais'}
                </button>
              </div>
            </form>
          </section>

          {/* Zona de Perigo */}
          <section className="bg-surface border border-error/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full blur-2xl pointer-events-none"></div>
            <h2 className="text-lg font-bold text-error mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined">warning</span>
              Zona de Perigo
            </h2>
            <p className="text-sm text-text-muted mb-6 relative z-10 max-w-2xl">
              As ações nesta área são irreversíveis. A exclusão da conta removerá permanentemente todos os seus agendamentos, tarefas e dados.
            </p>
            <div className="relative z-10 inline-block">
              <DeleteAccountModal />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
