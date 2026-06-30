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
    return redirect('/login?error=Credenciais inválidas')
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
