import { Plus } from 'lucide-react';
import type { Task, TaskStage } from '../types';
import { STAGE_LABELS } from '../types';
import { TaskCard } from './TaskCard';
import { Button } from './Button';

interface TaskColumnProps {
  stage: TaskStage;
  tasks: Task[];
  onAdd: (stage: TaskStage) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, stage: TaskStage) => void;
  deletingId: number | null;
}

const columnStyles: Record<TaskStage, string> = {
  todo: 'bg-muted/30',
  in_progress: 'bg-accent/20',
  done: 'bg-primary/5',
};

const headerColors: Record<TaskStage, string> = {
  todo: 'text-foreground',
  in_progress: 'text-secondary',
  done: 'text-primary',
};

export function TaskColumn({
  stage,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onMove,
  deletingId,
}: TaskColumnProps) {
  return (
    <section
      className={`flex flex-col rounded-[2rem] border border-border/30 p-4 sm:p-5 ${columnStyles[stage]}`}
      aria-label={`${STAGE_LABELS[stage]} column`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className={`font-heading text-xl font-bold ${headerColors[stage]}`}>
            {STAGE_LABELS[stage]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => onAdd(stage)}
          aria-label={`Add task to ${STAGE_LABELS[stage]}`}
          className="h-10 w-10 rounded-2xl bg-primary/10 px-0 hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[1.5rem] border border-dashed border-border/60 px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks here yet. Tap + to plant one.
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              isDeleting={deletingId === task.id}
              shapeIndex={index}
            />
          ))
        )}
      </div>
    </section>
  );
}
