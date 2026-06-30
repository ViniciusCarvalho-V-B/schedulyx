'use client'

import Image from "next/image";
import { AppointmentForm } from '@/components/dashboard/AppointmentForm'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Header() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single()
          .then(({ data: profileData }) => {
            if (profileData) setProfile(profileData)
          })
      }
    })
  }, [])

  return (
    <header className="flex justify-between items-center w-full px-8 py-2 sticky top-0 z-40 bg-background border-b border-border h-16 shrink-0">
      <div className="flex items-center gap-4 md:hidden">
        <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">menu</span>
        <span className="text-xl font-bold text-on-surface">Schedulyx</span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-surface border border-border rounded-lg px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-text-muted w-64 outline-none" 
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="material-symbols-outlined text-text-muted hover:text-on-surface transition-colors">notifications</button>
        <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden relative flex items-center justify-center text-xs font-bold text-white shrink-0">
          {profile?.avatar_url ? (
            <Image 
              src={profile.avatar_url}
              alt="User Avatar" 
              fill 
              className="object-cover" 
            />
          ) : (
            'U'
          )}
        </div>
        
        {/* Renderiza o botão que abre o Drawer Lateral */}
        <div className="hidden md:block">
          <AppointmentForm />
        </div>
      </div>
    </header>
  );
}
