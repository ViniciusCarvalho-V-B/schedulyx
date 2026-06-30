'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const amountStr = formData.get('amount') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  const category = formData.get('category') as string || null
  const date = formData.get('data') as string
  const time = formData.get('hora') as string
  
  if (!description || !amountStr || !type || !status) {
    return { error: 'Preencha todos os campos da transação.' }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'O valor da transação deve ser maior que zero.' }
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Usuário não autenticado.' }
  }

  let transaction_date = null
  if (date) {
    const timeStr = time ? `${time}:00` : '00:00:00'
    transaction_date = new Date(`${date}T${timeStr}`).toISOString()
  }

  const { error } = await supabase.from('transactions').insert({
    description: description,
    amount: amount,
    type: type,
    status: status,
    category: category,
    ...(transaction_date && { transaction_date })
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/finance')
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const amountStr = formData.get('amount') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  const category = formData.get('category') as string || null
  const date = formData.get('data') as string
  const time = formData.get('hora') as string
  
  if (!description || !amountStr || !type || !status) {
    return { error: 'Preencha todos os campos da transação.' }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'O valor da transação deve ser maior que zero.' }
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Usuário não autenticado.' }
  }

  let transaction_date = null
  if (date) {
    const timeStr = time ? `${time}:00` : '00:00:00'
    transaction_date = new Date(`${date}T${timeStr}`).toISOString()
  }

  const updateData: any = {
    description,
    amount,
    type,
    status,
    category
  }
  
  if (transaction_date) {
    updateData.transaction_date = transaction_date
  }

  const { error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/finance')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Usuário não autenticado.' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/finance')
  return { success: true }
}
