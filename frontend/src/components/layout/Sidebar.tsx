'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { name: 'Agenda', path: '/', icon: 'calendar_month' },
    { name: 'Kanban', path: '/kanban', icon: 'view_kanban' },
    { name: 'Finanças', path: '/finance', icon: 'payments' },
  ]

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col bg-surface border-r border-border z-40">
      <div className="px-6 py-8 flex items-center gap-3 border-b border-border">
        <svg fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
          <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="8" y="8" />
          <rect height="16" rx="2" stroke="#1E293B" strokeWidth="2" width="16" x="16" y="16" />
          <rect fill="#d97707" height="8" rx="1" style={{ filter: "drop-shadow(0px 0px 8px rgba(217,119,7,0.6))" }} width="8" x="16" y="16" />
        </svg>
        <span className="text-xl font-bold text-white tracking-tight">schedulyx</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out ${
                isActive 
                  ? 'bg-primary-container/10 border border-primary/20 text-primary' 
                  : 'text-text-muted hover:bg-surface-container-high hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col border-t border-border pt-4 mt-auto space-y-4 px-3 pb-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-surface-container-high border border-border flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-sm font-medium text-white truncate">Meu Perfil</span>
            <span className="text-xs text-text-muted truncate">{user?.email || 'Carregando...'}</span>
          </div>
          <button onClick={handleLogout} className="text-text-muted hover:text-white transition-colors p-1" title="Sair">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
        
        <DeleteAccountModal />
      </div>
    </aside>
  );
}
