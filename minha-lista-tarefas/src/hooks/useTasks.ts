import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as TaskRepository from "../database/taskRepository";
import { Task, TaskFilter } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);

  // Carrega todas as tarefas do banco
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskRepository.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela ganhar foco (ao voltar do formulário)
  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks]),
  );

  // Filtra as tarefas no frontend conforme o filtro ativo
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.completed === 0;
    if (filter === "completed") return task.completed === 1;
    return true;
  });

  const toggleTask = useCallback(
    async (id: number, currentCompleted: number) => {
      const newCompleted = currentCompleted === 0 ? 1 : 0;
      await TaskRepository.toggleTaskComplete(id, newCompleted);
      await loadTasks();
    },
    [loadTasks],
  );

  const removeTask = useCallback(
    async (id: number) => {
      await TaskRepository.deleteTask(id);
      await loadTasks();
    },
    [loadTasks],
  );

  return {
    tasks: filteredTasks,
    allTasksCount: tasks.length,
    pendingCount: tasks.filter((t) => t.completed === 0).length,
    completedCount: tasks.filter((t) => t.completed === 1).length,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  };
}
