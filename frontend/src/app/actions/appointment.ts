'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(formData: FormData) {
  const supabase = await createClient()

  const serviceName = formData.get('service_name') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const priceStr = formData.get('price') as string
  
  if (!serviceName || !date || !time || !priceStr) {
    return { error: 'Por favor, preencha todos os campos.' }
  }

  const price = parseFloat(priceStr)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Usuário não autenticado.' }
  }

  const { error } = await supabase.from('appointments').insert({
    client_id: user.id, // Simulando que o agendamento pertence a quem cria (neste MVP)
    service_name: serviceName,
    date: date,
    time: time,
    price: price,
    status: 'confirmado' // Para disparar a Trigger de criação da Task!
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
