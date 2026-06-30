'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface Task {
  id: string;
  title: string;
  client_name?: string;
  service_name?: string;
  date?: string;
  time?: string;
  price?: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pendente' | 'confirmado' | 'completed';
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
    opacity: isDragging ? 0.4 : 1,
  };

  // Format date for display
  const formattedDate = task.date 
    ? new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : null;

  // Format price
  const formattedPrice = task.price 
    ? task.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-surface border rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-150 group ${
        isDragging 
          ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02] rotate-1' 
          : 'border-border hover:border-border-bright'
      }`}
    >
      {/* Service Name */}
      <h4 className="text-sm font-medium text-on-surface leading-snug mb-2">
        {task.title || task.service_name || 'Sem título'}
      </h4>

      {/* Date & Time */}
      {(formattedDate || task.time) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[14px] text-text-muted">schedule</span>
          <span className="text-xs text-text-muted">
            {formattedDate}{task.time ? ` às ${task.time}` : ''}
          </span>
        </div>
      )}

      {/* Footer: Client + Price */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        {task.client_name ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[12px] text-text-muted">person</span>
            </div>
            <span className="text-xs text-text-muted truncate max-w-[100px]">{task.client_name}</span>
          </div>
        ) : (
          <div />
        )}
        
        {formattedPrice && (
          <span className="text-xs font-medium text-primary">{formattedPrice}</span>
        )}
      </div>

      {/* Drag handle indicator - appears on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-[14px] text-text-muted">drag_indicator</span>
      </div>
    </div>
  )
}
