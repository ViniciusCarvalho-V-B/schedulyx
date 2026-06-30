'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface Task {
  id: string;
  title: string;
  client_name?: string;
  service_name?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-surface border p-4 rounded-lg shadow-sm hover:border-primary/50 transition-colors cursor-grab active:cursor-grabbing mb-3 group relative ${isDragging ? 'border-primary shadow-primary/20' : 'border-border'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-white leading-tight pr-2">
          {task.title || task.service_name || 'Agendamento'}
        </h4>
        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider shrink-0 ${
          task.priority === 'high' ? 'bg-error/10 border border-error/20 text-error' :
          task.priority === 'medium' ? 'bg-warning/10 border border-warning/20 text-warning' :
          'bg-success/10 border border-success/20 text-success'
        }`}>
          {task.priority || 'medium'}
        </span>
      </div>
      {task.client_name && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50">
          <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[12px] text-text-muted">person</span>
          </div>
          <span className="text-xs font-medium text-text-muted truncate">{task.client_name}</span>
        </div>
      )}
    </div>
  )
}
