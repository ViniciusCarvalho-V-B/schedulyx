'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const description = formData.get('description') as string
  const amountStr = formData.get('amount') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  
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

  const { error } = await supabase.from('transactions').insert({
    description: description,
    amount: amount,
    type: type,
    status: status
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/finance')
  return { success: true }
}
