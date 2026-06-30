import Link from "next/link";
import { login, signInWithGoogle } from "@/app/actions/auth";
import { PasswordInput } from "@/components/PasswordInput";

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;
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
          <h1 className="text-5xl font-bold text-white mb-8 leading-tight">A engrenagem invisível por trás da sua operação.</h1>
          <p className="text-base text-text-muted">
            Schedulyx conecta agendamentos de forma inteligente ao seu fluxo Kanban, transformando tarefas operacionais em receita previsível e controle financeiro absoluto.
          </p>
        </div>
        
        {/* Footer: Badges */}
        <div className="z-10 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-container-low/50 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-[11px] font-bold text-text-muted uppercase">Agenda Inteligente</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-container-low/50 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>view_kanban</span>
            <span className="text-[11px] font-bold text-text-muted uppercase">Kanban Integrado</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-container-low/50 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-[#ffb695]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <span className="text-[11px] font-bold text-text-muted uppercase">Finanças Automatizadas</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-[#0c0f10]">
        
        {/* Floating Card */}
        <div className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-8">
          
          {/* Mobile Logo (Hidden on desktop) */}
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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Entrar na sua conta</h2>
            <p className="text-sm text-text-muted">Insira suas credenciais para acessar o painel</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" action={login}>
            
            {error && (
              <div className="bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg flex justify-between items-start gap-3">
                <span className="flex-1">{error}</span>
                <Link href="/login" className="material-symbols-outlined text-[18px] opacity-70 hover:opacity-100 transition-opacity">close</Link>
              </div>
            )}

            <button type="submit" formAction={signInWithGoogle} className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg hover:bg-surface-container-high transition-colors text-sm font-medium text-white cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com o Google
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-text-muted">ou com e-mail corporativo</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="email">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">mail</span>
                <input 
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all duration-300 ease-in-out" 
                  id="email" 
                  name="email" 
                  placeholder="nome@empresa.com" 
                  required 
                  type="email" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-text-muted" htmlFor="password">Senha</label>
                <Link className="text-xs font-medium text-primary hover:text-indigo-400 transition-colors cursor-pointer" href="/login?error=Recuperação+de+senha+disponível+em+breve">Esqueceu a senha?</Link>
              </div>
              <PasswordInput />
            </div>

            {/* Submit Button */}
            <button className="w-full btn-primary hover:bg-inverse-primary text-white text-sm font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer" type="submit">
              Entrar
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Signup Link */}
          <div className="text-center text-text-muted text-sm mt-2">
            Não tem uma conta? <Link href="/register" className="text-indigo-500 hover:text-indigo-400 hover:underline font-bold cursor-pointer transition-all duration-300 ease-in-out">Cadastre-se</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
