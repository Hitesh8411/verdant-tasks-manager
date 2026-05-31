import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const VALID_STAGES = ['todo', 'in_progress', 'done'];

router.use(authMiddleware);

function formatTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    stage: row.stage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY updated_at DESC')
    .all(req.user.id);
  res.json({ tasks: rows.map(formatTask) });
});

router.post('/', (req, res) => {
  const { title, description = '', stage = 'todo' } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (!VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage' });
  }

  const result = db
    .prepare(
      'INSERT INTO tasks (user_id, title, description, stage) VALUES (?, ?, ?, ?)'
    )
    .run(req.user.id, title.trim(), description.trim(), stage);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ task: formatTask(task) });
});

router.patch('/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const existing = db
    .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
    .get(taskId, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, stage } = req.body;
  const updates = [];
  const values = [];

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }
    updates.push('title = ?');
    values.push(title.trim());
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description.trim());
  }

  if (stage !== undefined) {
    if (!VALID_STAGES.includes(stage)) {
      return res.status(400).json({ error: 'Invalid stage' });
    }
    updates.push('stage = ?');
    values.push(stage);
  }

  if (updates.length === 0) {
    return res.json({ task: formatTask(existing) });
  }

  updates.push("updated_at = datetime('now')");
  values.push(taskId, req.user.id);

  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(
    ...values
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json({ task: formatTask(task) });
});

router.delete('/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const result = db
    .prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
    .run(taskId, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

export default router;
