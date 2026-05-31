export type TaskStage = 'todo' | 'in_progress' | 'done';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  stage: TaskStage;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}

export const STAGE_LABELS: Record<TaskStage, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export const STAGE_ORDER: TaskStage[] = ['todo', 'in_progress', 'done'];
