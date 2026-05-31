import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Task, TaskStage } from '../types';
import { STAGE_LABELS } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; stage: TaskStage }) => Promise<void>;
  initialStage?: TaskStage;
  task?: Task | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialStage = 'todo',
  task = null,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<TaskStage>(initialStage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!task;

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setStage(task?.stage ?? initialStage);
      setError(null);
    }
  }, [isOpen, task, initialStage]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please give your task a title');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), stage });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="card-surface relative w-full max-w-lg rounded-[2rem] p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="task-modal-title" className="font-heading text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            autoFocus
            required
          />

          <Textarea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a few details..."
            rows={3}
          />

          <div className="space-y-2">
            <label htmlFor="task-stage" className="block text-sm font-semibold text-foreground">
              Stage
            </label>
            <select
              id="task-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as TaskStage)}
              className="input-field cursor-pointer appearance-none"
            >
              {(Object.keys(STAGE_LABELS) as TaskStage[]).map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="sm:px-6">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
