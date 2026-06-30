'use client'

import { useRef, useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { uploadAvatar } from '@/app/actions/settings'

interface ProfileEditorProps {
  profile: {
    full_name: string | null
    phone: string | null
    avatar_url: string | null
  }
  email: string
}

export default function ProfileEditor({ profile, email }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials = (profile.full_name || email)
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.url) {
      setAvatarUrl(result.url)
      setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' })
    }

    setIsUploadingAvatar(false)
  }

  function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        setIsEditing(false)
      }
    })
  }

  return (
    <div className="space-y-gutter">
      {/* Header / Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-gutter">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar do usuário"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary">{initials}</span>
            )}

            {/* Hover upload overlay */}
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              {isUploadingAvatar ? (
                <span className="material-symbols-outlined text-on-surface animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-on-surface">photo_camera</span>
                  <span className="text-xs text-on-surface mt-1">Alterar</span>
                </>
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Name and email */}
        <div className="flex-1 min-w-0">
          <h2 className="font-headline-lg text-headline-lg text-on-surface truncate">
            {profile.full_name || 'Usuário'}
          </h2>
          <p className="text-text-muted text-body-md mt-1 truncate">{email}</p>
          {profile.phone && (
            <p className="text-text-muted text-body-sm mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">phone</span>
              {profile.phone}
            </p>
          )}
        </div>

        {/* Edit / Cancel button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing)
              setMessage(null)
            }}
            className="px-4 py-2 rounded-lg border border-border text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEditing ? 'close' : 'edit'}
            </span>
            <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
          </button>
        </div>
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 animate-fade-in ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-error/10 border border-error/30 text-error'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      {/* Inline edit form */}
      {isEditing && (
        <form
          action={handleSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-5 animate-zoom-in"
        >
          <h3 className="text-on-surface font-medium text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Editar Informações
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm text-text-muted block">
                Nome Completo
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile.full_name || ''}
                required
                minLength={2}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-on-surface placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-text-muted block">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone || ''}
                className="w-full bg-surface-container-low border border-border rounded-lg px-4 py-2.5 text-on-surface placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setMessage(null)
              }}
              className="px-4 py-2 rounded-lg border border-border text-text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
