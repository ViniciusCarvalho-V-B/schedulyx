'use client'

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskCard } from './TaskCard'

interface KanbanColumnProps {
  id: 'pendente' | 'confirmado' | 'completed';
  title: string;
  tasks: Task[];
  color: string; // dot color class
}

export function KanbanColumn({ id, title, tasks, color }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`w-80 shrink-0 flex flex-col h-full rounded-xl transition-all duration-200 ${
        isOver 
          ? 'bg-primary-container/5 ring-1 ring-primary/30' 
          : ''
      } ${id === 'completed' ? 'opacity-75 hover:opacity-100' : ''}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
          <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
          <span className="text-xs text-text-muted bg-surface-container-high px-2 py-0.5 rounded-full border border-border font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 pb-4 custom-scrollbar">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className={`flex-1 flex items-center justify-center rounded-lg border-2 border-dashed p-8 min-h-[120px] transition-colors ${
            isOver ? 'border-primary/50 bg-primary-container/5' : 'border-border/40'
          }`}>
            <p className="text-xs text-text-muted text-center">
              Arraste agendamentos<br />para esta coluna
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
