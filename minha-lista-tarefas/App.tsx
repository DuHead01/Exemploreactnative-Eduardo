import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createTask } from "./src/database/taskRepository";
import { useTasks } from "./src/hooks/useTasks";
import { TaskFilter } from "./src/types/task";

const FILTERS: Array<{ key: TaskFilter; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "completed", label: "Concluídas" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  panel: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#a5b4fc",
    fontWeight: "700",
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 0,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
  },
  summaryCardDark: {
    backgroundColor: "#1e293b",
  },
  summaryCardAmber: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
  },
  summaryCardGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  summaryLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
  },
  formCard: {
    marginTop: 22,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    backgroundColor: "#0f172a",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 14,
    backgroundColor: "#10b981",
  },
  primaryButtonText: {
    color: "#062b22",
    fontSize: 16,
    fontWeight: "800",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 22,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterButtonInactive: {
    borderColor: "#334155",
    backgroundColor: "#0f172a",
  },
  filterButtonActive: {
    borderColor: "#818cf8",
    backgroundColor: "rgba(99,102,241,0.2)",
  },
  filterText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextInactive: {
    color: "#cbd5e1",
  },
  filterTextActive: {
    color: "#e0e7ff",
  },
  list: {
    marginTop: 20,
  },
  taskCard: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskContent: {
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#34d399",
  },
  checkboxText: {
    color: "#062b22",
    fontSize: 11,
    fontWeight: "800",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  taskTitleCompleted: {
    color: "#64748b",
    textDecorationLine: "line-through",
  },
  taskDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#cbd5e1",
  },
  taskDescriptionCompleted: {
    color: "#64748b",
  },
  deleteButton: {
    borderRadius: 12,
    backgroundColor: "rgba(244, 63, 94, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteText: {
    color: "#fda4af",
    fontWeight: "700",
  },
  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    padding: 22,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },
});

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {
    tasks,
    loading,
    pendingCount,
    completedCount,
    allTasksCount,
    filter,
    setFilter,
    refreshTasks,
    toggleTask,
    removeTask,
  } = useTasks();

  async function handleAddTask() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    await createTask({
      title: normalizedTitle,
      description: description.trim() || null,
    });

    setTitle("");
    setDescription("");
    await refreshTasks();
  }

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.badgeText}>Agenda</Text>
            <Text style={styles.title}>Minha lista</Text>
          </View>

          <View style={styles.iconBox}>
            <Text style={{ fontSize: 22 }}>✅</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardDark]}>
            <Text style={[styles.summaryLabel, { color: "#94a3b8" }]}>
              Total
            </Text>
            <Text style={[styles.summaryValue, { color: "#ffffff" }]}>
              {allTasksCount}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardAmber]}>
            <Text style={[styles.summaryLabel, { color: "#fcd34d" }]}>
              Pendentes
            </Text>
            <Text style={[styles.summaryValue, { color: "#fbbf24" }]}>
              {pendingCount}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.summaryCardGreen]}>
            <Text style={[styles.summaryLabel, { color: "#86efac" }]}>
              Feitas
            </Text>
            <Text style={[styles.summaryValue, { color: "#34d399" }]}>
              {completedCount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Título da tarefa"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />

        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Descrição (opcional)"
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
          multiline
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() => void handleAddTask()}
        >
          <Text style={styles.primaryButtonText}>Adicionar tarefa</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = filter === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterButton,
                active
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  active ? styles.filterTextActive : styles.filterTextInactive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(task) => String(task.id)}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskRow}>
              <Pressable
                style={styles.taskContent}
                onPress={() => void toggleTask(item.id, item.completed)}
                hitSlop={8}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.completed === 1 && styles.checkboxChecked,
                    ]}
                  >
                    {item.completed === 1 ? (
                      <Text style={styles.checkboxText}>✓</Text>
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.taskTitle,
                      item.completed === 1 && styles.taskTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                {item.description ? (
                  <Text
                    style={[
                      styles.taskDescription,
                      item.completed === 1 && styles.taskDescriptionCompleted,
                    ]}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </Pressable>

              <Pressable
                onPress={() => void removeTask(item.id)}
                hitSlop={8}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {loading ? "Carregando tarefas..." : "Nenhuma tarefa cadastrada."}
            </Text>
          </View>
        }
      />
      <StatusBar style="light" />
    </View>
  );
}
