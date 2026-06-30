'use client'

import { useState } from 'react'
import { KanbanColumn } from './KanbanColumn'
import { Task } from './TaskCard'

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto h-full items-start pb-4">
      <KanbanColumn id="todo" title="A Fazer" tasks={todoTasks} />
      <KanbanColumn id="in_progress" title="Em Andamento" tasks={inProgressTasks} />
      <KanbanColumn id="done" title="Concluído" tasks={doneTasks} />
    </div>
  )
}
