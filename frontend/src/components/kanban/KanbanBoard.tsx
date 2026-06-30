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

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // require a slight movement before dragging to allow normal clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const doneTasks = tasks.filter(t => t.status === 'done')

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

    // Se estiver movendo por cima de outra task
    if (isActiveTask && isOverTask) {
      setTasks(currentTasks => {
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);
        const overIndex = currentTasks.findIndex(t => t.id === overId);
        
        const activeTaskStatus = currentTasks[activeIndex].status;
        const overTaskStatus = currentTasks[overIndex].status;

        // Optimistic Update: Mudou de coluna
        if (activeTaskStatus !== overTaskStatus) {
          const newTasks = [...currentTasks];
          newTasks[activeIndex] = { ...newTasks[activeIndex], status: overTaskStatus };
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        // Reordenou na mesma coluna
        return arrayMove(currentTasks, activeIndex, overIndex);
      });
    }

    // Se estiver movendo para uma coluna vazia (direto no container)
    if (isActiveTask && isOverColumn) {
      setTasks(currentTasks => {
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);
        const newTasks = [...currentTasks];
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: overId as any };
        return arrayMove(newTasks, activeIndex, newTasks.length - 1);
      });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const dragTask = activeTask;
    setActiveTask(null); // Clear active task immediately for overlay
    
    if (!over || !dragTask) return;

    const activeId = active.id;
    const activeTaskFinal = tasks.find(t => t.id === activeId);
    
    // Check if the status actually changed during this drag session
    if (activeTaskFinal && dragTask.status !== activeTaskFinal.status) {
      // Async Server Action - Dispara o update no Supabase em background
      const result = await updateTaskStatus(activeId as string, activeTaskFinal.status);
      
      if (!result.success) {
        console.error("Erro ao persistir status:", result.error);
        alert(`Não foi possível salvar: ${result.error}`);
        // Num cenário robusto, faríamos o rollback do estado aqui (tasks = initialTasks ou similar)
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
      <div className="flex-1 flex gap-6 overflow-x-auto h-full items-start pb-4">
        <KanbanColumn id="todo" title="A Fazer" tasks={todoTasks} />
        <KanbanColumn id="in_progress" title="Em Andamento" tasks={inProgressTasks} />
        <KanbanColumn id="done" title="Concluído" tasks={doneTasks} />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-2 scale-105 transition-transform cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
