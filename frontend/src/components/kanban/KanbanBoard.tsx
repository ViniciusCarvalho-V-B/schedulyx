'use client'

import { useState } from 'react'
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent 
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn'
import { Task, TaskCard } from './TaskCard'
import { updateTaskStatus } from '@/app/actions/tasks'
import { toast } from 'sonner'

interface KanbanBoardProps {
  initialTasks: Task[];
}

const COLUMNS = [
  { id: 'pendente' as const, title: 'A Fazer', color: 'bg-amber-500' },
  { id: 'confirmado' as const, title: 'Em Andamento', color: 'bg-blue-500' },
  { id: 'completed' as const, title: 'Concluído', color: 'bg-emerald-500' },
]

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id)
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks(currentTasks => {
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);
        const overIndex = currentTasks.findIndex(t => t.id === overId);
        
        const activeTaskStatus = currentTasks[activeIndex].status;
        const overTaskStatus = currentTasks[overIndex].status;

        if (activeTaskStatus !== overTaskStatus) {
          const newTasks = [...currentTasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], status: overTaskStatus };
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(currentTasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks(currentTasks => {
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);
        const newTasks = [...currentTasks];
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: overId as Task['status'] };
        return arrayMove(newTasks, activeIndex, newTasks.length - 1);
      });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    const dragTask = activeTask;
    setActiveTask(null);
    
    if (!dragTask) return;

    const activeId = active.id;
    const activeTaskFinal = tasks.find(t => t.id === activeId);
    
    if (activeTaskFinal && dragTask.status !== activeTaskFinal.status) {
      const result = await updateTaskStatus(activeId as string, activeTaskFinal.status);
      
      if (!result.success) {
        console.error("Erro ao persistir status:", result.error);
        toast.error(`Não foi possível salvar: ${result.error}`);
        // Rollback
        setTasks(prev => prev.map(t => 
          t.id === activeId ? { ...t, status: dragTask.status } : t
        ));
      } else {
        toast.success('Status atualizado!')
      }
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex gap-6 overflow-x-auto h-full items-start pb-4 custom-scrollbar">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.id}
            id={col.id} 
            title={col.title} 
            tasks={tasks.filter(t => t.status === col.id)} 
            color={col.color}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-2 scale-105 shadow-2xl shadow-primary/20">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
