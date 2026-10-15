import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as TaskRepository from "../src/database/taskRepository";
import { Task } from "../src/types/task";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    marginRight: 16,
    paddingVertical: 8,
    paddingRight: 8,
  },
  backText: {
    color: "#a5b4fc",
    fontSize: 16,
    fontWeight: "700",
  },
  heading: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  description: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 24,
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
  multiline: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 14,
    backgroundColor: "#10b981",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#062b22",
    fontSize: 16,
    fontWeight: "800",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#cbd5e1",
    marginTop: 12,
  },
});

export default function TaskFormScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const taskId = Number(id);
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTask() {
      if (!id || !Number.isInteger(taskId) || taskId <= 0) {
        Alert.alert("Tarefa inválida", "Não foi possível identificar a tarefa.");
        router.back();
        return;
      }

      try {
        const existingTask = await TaskRepository.getTaskById(taskId);
        if (!active) return;

        if (!existingTask) {
          Alert.alert("Tarefa não encontrada", "Ela pode ter sido excluída.");
          router.back();
          return;
        }

        setTask(existingTask);
        setTitle(existingTask.title);
        setDescription(existingTask.description ?? "");
      } catch (error) {
        console.error("Erro ao carregar tarefa para edição:", error);
        if (active) {
          Alert.alert("Erro", "Não foi possível carregar esta tarefa.");
          router.back();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTask();
    return () => {
      active = false;
    };
  }, [id, router, taskId]);

  async function handleSave() {
    const normalizedTitle = title.trim();
    if (!task || !normalizedTitle || saving) return;

    setSaving(true);
    try {
      await TaskRepository.updateTask({
        id: task.id,
        title: normalizedTitle,
        description: description.trim() || null,
      });
      router.back();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro ao salvar", "Não foi possível atualizar a tarefa.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#a5b4fc" />
        <Text style={styles.loadingText}>Carregando tarefa...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a lista"
          >
            <Text style={styles.backText}>‹ Voltar</Text>
          </Pressable>
          <Text style={styles.heading}>Editar tarefa</Text>
        </View>

        <Text style={styles.description}>
          Atualize o título ou a descrição da sua tarefa.
        </Text>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Título da tarefa"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
            maxLength={120}
            returnKeyType="next"
            accessibilityLabel="Título da tarefa"
          />

          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Descrição (opcional)"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Descrição da tarefa"
          />

          <Pressable
            onPress={() => void handleSave()}
            disabled={!task || !title.trim() || saving}
            style={[styles.saveButton, (!title.trim() || saving) && styles.saveButtonDisabled]}
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator color="#062b22" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
