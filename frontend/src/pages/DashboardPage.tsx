import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { Task, TaskStage } from '../types';
import { STAGE_ORDER } from '../types';
import { BlobBackground } from '../components/BlobBackground';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Navbar } from '../components/Navbar';
import { TaskColumn } from '../components/TaskColumn';
import { TaskModal } from '../components/TaskModal';

export function DashboardPage() {
  const { user, isInitializing: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStage, setInitialStage] = useState<TaskStage>('todo');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      const { tasks: fetched } = await api.getTasks();
      setTasks(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Waking up your garden..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const openCreateModal = (stage: TaskStage) => {
    setEditingTask(null);
    setInitialStage(stage);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { title: string; description: string; stage: TaskStage }) => {
    if (editingTask) {
      const { task } = await api.updateTask(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } else {
      const { task } = await api.createTask(data.title, data.description, data.stage);
      setTasks((prev) => [task, ...prev]);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMove = async (id: number, stage: TaskStage) => {
    setError(null);
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stage } : t))
    );
    try {
      const { task } = await api.updateTask(id, { stage });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (err) {
      setTasks(previous);
      setError(err instanceof Error ? err.message : 'Failed to move task');
    }
  };

  const tasksByStage = STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = tasks.filter((t) => t.stage === stage);
      return acc;
    },
    {} as Record<TaskStage, Task[]>
  );

  return (
    <div className="relative min-h-dvh pb-16">
      <BlobBackground variant={1} color="moss" className="left-[-15%] top-32 h-96 w-96 opacity-60" />
      <BlobBackground variant={2} color="clay" className="right-[-10%] top-[40%] h-80 w-80 opacity-50" />

      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Your task garden
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Move tasks through each stage as they grow — from seed to harvest.
          </p>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner message="Gathering your tasks..." />
        ) : (
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {STAGE_ORDER.map((stage) => (
              <TaskColumn
                key={stage}
                stage={stage}
                tasks={tasksByStage[stage]}
                onAdd={openCreateModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onMove={handleMove}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialStage={initialStage}
        task={editingTask}
      />
    </div>
  );
}
