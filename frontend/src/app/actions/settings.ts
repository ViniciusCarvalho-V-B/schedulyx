'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Atualiza Nome Completo
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const fullName = formData.get('fullName') as string
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/settings')
  return { success: true }
}

// 2. Atualiza Email ou Senha
export async function updateSecurity(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const newPassword = formData.get('newPassword') as string
  const currentPassword = formData.get('currentPassword') as string
  
  if (!currentPassword) {
    return { error: 'A senha atual é obrigatória para alterar credenciais.' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { error: 'Usuário não autenticado.' }

  // VERIFICAÇÃO DE SEGURANÇA BANCÁRIA
  // Tenta logar no background para validar a senha atual
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (signInError) {
    return { error: 'Senha atual incorreta. Acesso negado.' }
  }

  const updates: any = {}
  if (email && email !== user.email) updates.email = email
  if (newPassword && newPassword.length >= 6) updates.password = newPassword

  if (Object.keys(updates).length === 0) {
    return { error: 'Nenhuma alteração detectada.' }
  }

  const { error } = await supabase.auth.updateUser(updates)

  if (error) return { error: error.message }
  
  revalidatePath('/settings')
  return { success: true, message: email ? 'Verifique seu novo e-mail para confirmar a alteração.' : 'Senha atualizada com sucesso!' }
}

// 3. Upload de Avatar
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('avatar') as File
  
  if (!file) return { error: 'Nenhum arquivo enviado.' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuário não autenticado.' }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}-${Math.random()}.${fileExt}`

  // 1. Upload pro Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return { error: 'Erro ao fazer upload da imagem: ' + uploadError.message }

  // 2. Obter URL Pública
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  // 3. Atualizar Tabela Profiles
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/', 'layout')
  return { success: true, url: publicUrl }
}
