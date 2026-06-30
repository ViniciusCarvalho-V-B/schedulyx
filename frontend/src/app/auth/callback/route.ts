import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // se houver 'next' redirect, usa ele, senão vai pro dashboard /
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // Troca o código da URL por uma Sessão JWT válida
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      const user = data.session.user
      
      // Cria a ponte administrativa para inserir o perfil do usuário
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Insere ou atualiza o perfil do usuário garantindo o acesso 'admin'
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'admin' // Estamos definindo admin por padrão como combinado para testes ERP
        })

      if (profileError) {
        console.error("Erro ao criar perfil Google:", profileError)
      }

      // Redireciona o usuário para a rota desejada (geralmente Dashboard)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se houver algum erro na troca de código
  return NextResponse.redirect(`${origin}/login?error=Erro+ao+autenticar+com+o+Google`)
}
