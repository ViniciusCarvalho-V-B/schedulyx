'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const fullName = (formData.get('fullName') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()

  if (!fullName || fullName.length < 2) {
    return { error: 'O nome deve ter pelo menos 2 caracteres.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone || null,
    })
    .eq('id', user.id)

  if (error) return { error: 'Erro ao atualizar perfil: ' + error.message }

  revalidatePath('/profile')
  revalidatePath('/', 'layout')
  return { success: true }
}
