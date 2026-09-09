import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { createTask } from "./src/database/taskRepository";
import { useTasks } from "./src/hooks/useTasks";

export default function App() {
  const [title, setTitle] = useState("");
  const {
    tasks,
    loading,
    pendingCount,
    completedCount,
    toggleTask,
    removeTask,
  } = useTasks();

  async function handleAddTask() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    await createTask({ title: normalizedTitle, description: null });
    setTitle("");
  }

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-16">
      <Text className="text-3xl font-bold text-white">Minha lista</Text>
      <Text className="mt-2 text-slate-400">
        {pendingCount} pendentes · {completedCount} concluídas
      </Text>

      <View className="mt-8 flex-row gap-3">
        <TextInput
          className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-white"
          placeholder="Nova tarefa"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <Pressable
          className="justify-center rounded-xl bg-emerald-500 px-5"
          onPress={handleAddTask}
        >
          <Text className="font-bold text-slate-950">Adicionar</Text>
        </Pressable>
      </View>

      <FlatList
        className="mt-8"
        data={tasks}
        keyExtractor={(task) => String(task.id)}
        refreshing={loading}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center rounded-xl bg-slate-800 p-4">
            <Pressable
              className="flex-1"
              onPress={() => void toggleTask(item.id, item.completed)}
            >
              <Text
                className={
                  item.completed === 1
                    ? "text-base text-slate-500 line-through"
                    : "text-base text-white"
                }
              >
                {item.title}
              </Text>
            </Pressable>
            <Pressable onPress={() => void removeTask(item.id)}>
              <Text className="font-semibold text-rose-400">Excluir</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-500">
            {loading ? "Carregando tarefas..." : "Nenhuma tarefa cadastrada."}
          </Text>
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}
