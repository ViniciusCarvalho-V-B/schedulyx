import Link from "next/link";
import { login, signup } from "@/app/actions/auth";
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
              <div className="bg-error/10 border border-error text-error text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-text-muted" htmlFor="email">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-[20px]">mail</span>
                <input 
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-on-surface placeholder-text-muted text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" 
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

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-[11px] font-bold text-text-muted uppercase">ou continue com</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* SSO */}
          <button className="w-full bg-transparent border border-border text-white text-sm font-medium rounded-lg py-3 flex items-center justify-center gap-3 transition-colors cursor-not-allowed opacity-50" type="button" disabled>
            <svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" fill="#4285F4"></path>
                <path d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" fill="#34A853"></path>
                <path d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" fill="#FBBC05"></path>
                <path d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" fill="#EA4335"></path>
              </g>
            </svg>
            Continuar com Google (Em breve)
          </button>

          {/* Signup Link */}
          <p className="text-center text-text-muted text-sm">
            Não tem uma conta? <button type="submit" formAction={signup} className="text-primary hover:underline font-medium cursor-pointer">Cadastre-se</button>
          </p>

        </div>
      </div>
    </div>
  );
}
