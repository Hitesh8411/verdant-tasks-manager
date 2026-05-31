import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { Task, TaskStage } from '../types';
import { STAGE_LABELS } from '../types';
import { Button } from './Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, stage: TaskStage) => void;
  isDeleting?: boolean;
  shapeIndex?: number;
}

const cardRadii = [
  'rounded-[2rem]',
  'rounded-[2rem] rounded-tl-[4rem]',
  'rounded-[2rem] rounded-br-[4rem]',
  'rounded-[2rem] rounded-tr-[3rem] rounded-bl-[3rem]',
];

const STAGE_FLOW: Record<TaskStage, { prev?: TaskStage; next?: TaskStage }> = {
  todo: { next: 'in_progress' },
  in_progress: { prev: 'todo', next: 'done' },
  done: { prev: 'in_progress' },
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
  isDeleting = false,
  shapeIndex = 0,
}: TaskCardProps) {
  const flow = STAGE_FLOW[task.stage];

  return (
    <article
      className={`card-surface group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg hover:rotate-[0.5deg] ${cardRadii[shapeIndex % cardRadii.length]} ${isDeleting ? 'opacity-50' : ''}`}
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">{task.title}</h3>
      {task.description && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {flow.prev && (
          <Button
            variant="ghost"
            onClick={() => onMove(task.id, flow.prev!)}
            aria-label={`Move to ${STAGE_LABELS[flow.prev]}`}
            className="h-9 px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{STAGE_LABELS[flow.prev]}</span>
          </Button>
        )}

        {flow.next && (
          <Button
            variant="ghost"
            onClick={() => onMove(task.id, flow.next!)}
            aria-label={`Move to ${STAGE_LABELS[flow.next]}`}
            className="h-9 px-3"
          >
            <span className="sr-only sm:not-sr-only">{STAGE_LABELS[flow.next]}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="h-9 w-9 px-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
            className="h-9 w-9 px-0"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
