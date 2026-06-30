'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteUserAccount() {
  const serverClient = await createServerClient()
  const { data: { user }, error: authError } = await serverClient.auth.getUser()
  
  if (authError || !user) {
    return { error: "Usuário não autenticado." }
  }

  // Inicializar Admin Client do Supabase usando a chave service_role para contornar RLS e deletar o usuário real do Auth
  // ATENÇÃO: A service_role não deve NUNCA ir para o frontend (sem NEXT_PUBLIC)
  const adminAuthClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Apagar o usuário definitivamente da base de dados 
  // Isso aciona o ON DELETE CASCADE nas tabelas via chave estrangeira (perfis, agendamentos, etc)
  const { error: deleteError } = await adminAuthClient.auth.admin.deleteUser(
    user.id
  )

  if (deleteError) {
    return { error: deleteError.message }
  }

  // Deslogar a sessão local (remover cookies)
  await serverClient.auth.signOut()

  // Redirecionar para login informando sucesso
  redirect('/login?error=Sua+conta+e+dados+foram+excluídos+permanentemente.')
}
