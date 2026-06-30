'use client'

import { useState } from 'react'

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 flex items-center justify-center material-symbols-outlined text-text-muted text-[20px] pointer-events-none">lock</span>
      <input 
        className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-10 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
        id="password" 
        name="password" 
        placeholder="••••••••" 
        required 
        type={showPassword ? "text" : "password"} 
      />
      <button 
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 flex items-center justify-center text-text-muted hover:text-white transition-colors focus:outline-none"
      >
        <span className="material-symbols-outlined text-[20px] leading-none">
          {showPassword ? 'visibility' : 'visibility_off'}
        </span>
      </button>
    </div>
  )
}
