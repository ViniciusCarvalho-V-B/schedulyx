'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single()
          .then(({ data: profileData }) => {
            if (profileData) setProfile(profileData)
          })
      }
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Agenda', path: '/agenda', icon: 'calendar_today' },
    { name: 'Kanban', path: '/kanban', icon: 'view_kanban' },
    { name: 'Financeiro', path: '/finance', icon: 'payments' },
  ]

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col bg-surface border-r border-border z-50 shrink-0">
      <div className="px-6 py-6 flex items-center gap-4 border-b border-border h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">Schedulyx</h1>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md transition-all duration-200 ease-in-out ${
                isActive 
                  ? 'bg-surface-container-highest text-primary font-bold border-r-2 border-primary' 
                  : 'text-text-muted hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className={isActive ? 'text-label-md font-label-md' : ''}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-6 border-t border-border pt-4 space-y-1 shrink-0">
        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted font-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">account_circle</span>
          <span>Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted font-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">settings</span>
          <span>Configurações</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted font-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 ease-in-out">
          <span className="material-symbols-outlined">logout</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
