// Interface que representa uma Tarefa no banco de dados
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: number; // 0 = pendente, 1 = concluída
  createdAt: string; // formato ISO 8601
}

// Union type para os filtros disponíveis
export type TaskFilter = "all" | "pending" | "completed";

// Dados para criar uma nova tarefa (sem id, completed e createdAt)
export interface CreateTaskInput {
  title: string;
  description: string | null;
}

// Dados para editar uma tarefa existente
export interface UpdateTaskInput {
  id: number;
  title: string;
  description: string | null;
}
