'use client'

import { Task, TaskCard } from './TaskCard'

interface KanbanColumnProps {
  id: 'todo' | 'in_progress' | 'done';
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl border border-border h-full overflow-hidden w-80 shrink-0 shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface/80 backdrop-blur-sm z-10">
        <h3 className="font-semibold text-sm text-on-surface flex items-center gap-2">
          {title}
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-text-muted text-xs font-medium border border-border">
            {tasks.length}
          </span>
        </h3>
        <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-container-high text-text-muted transition-colors">
          <span className="material-symbols-outlined text-[16px]">more_horiz</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-surface-container-lowest">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
            <span className="text-xs font-medium text-text-muted">Arraste tarefas para cá</span>
          </div>
        )}
      </div>
    </div>
  )
}
