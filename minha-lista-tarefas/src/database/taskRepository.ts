import { getDatabase } from "./database";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

// Busca todas as tarefas, da mais recente para a mais antiga
export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.getAllAsync<Task>("SELECT * FROM tasks ORDER BY createdAt DESC");
}

// Busca uma tarefa específica pelo ID
export async function getTaskById(id: number): Promise<Task | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Task>("SELECT * FROM tasks WHERE id = ?", id);
}

// Cria uma nova tarefa e retorna ela com o ID gerado
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    "INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)",
    input.title,
    input.description,
    createdAt,
  );
  return (await getTaskById(result.lastInsertRowId))!;
}

// Atualiza título e descrição de uma tarefa
export async function updateTask(input: UpdateTaskInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
    input.title,
    input.description,
    input.id,
  );
}

// Alterna o status de conclusão (recebe o NOVO valor: 0 ou 1)
export async function toggleTaskComplete(
  id: number,
  completed: number,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    completed,
    id,
  );
}

// Remove uma tarefa permanentemente
export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}
