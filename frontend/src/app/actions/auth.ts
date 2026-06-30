'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.'
    if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Por favor, confirme seu e-mail antes de fazer login. (Ou desative a "Confirmação de E-mail" no painel do Supabase).'
    } else if (error.message) {
      errorMessage = error.message
    }
    return redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  redirect('/')
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function signUpWithPassword(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Usando upsert para garantir que o perfil seja atualizado caso uma Trigger de auth já o tenha criado
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: authData.user.id,
          full_name: fullName,
          role: 'admin' // Garantindo acesso de admin para testes
        })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: "Erro ao criar perfil de usuário no banco de dados." }
      }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Registration error:", err)
    return { error: "Erro interno do servidor durante o cadastro." }
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  // O NEXT_PUBLIC_SITE_URL deve estar configurado no .env.local, ou fazemos fallback para localhost
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error("Erro no signInWithOAuth:", error)
    return redirect('/login?error=Nao+foi+possivel+conectar+ao+Google')
  }

  if (data.url) {
    redirect(data.url) // Redireciona para a página de consentimento do Google
  }
}
