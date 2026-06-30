'use server'

import { createClient } from '@/utils/supabase/server'

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Usuário não autenticado." }
    }

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      console.error("Erro ao atualizar task:", error)
      return { success: false, error: "Falha ao atualizar a tarefa no banco de dados." }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Erro interno:", err)
    return { success: false, error: "Erro interno do servidor." }
  }
}
