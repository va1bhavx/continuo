import { useEffect, useState, useCallback, useMemo } from "react";
import { AppStorage } from "../lib/storage";
import type { TodoItem, TodoStatus } from "../lib/storage";

declare const chrome: any;

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      const saved = await AppStorage.getTodos();
      setTodos(saved);
    } catch (e) {
      console.error("Failed to load todos:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.todo_list_items) {
        loadTodos();
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "todo_list_items") {
        loadTodos();
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      return () => window.removeEventListener("local-storage-update", handleLocalUpdate);
    }
  }, [loadTodos]);

  const activeTodos = useMemo(
    () => todos.filter((t) => t.status === "active"),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter((t) => t.status === "completed"),
    [todos],
  );

  const deletedTodos = useMemo(
    () => todos.filter((t) => t.status === "deleted"),
    [todos],
  );

  const addTodo = useCallback(
    async (
      title: string,
      description: string = "",
      linkedSessionId?: string,
    ): Promise<TodoItem | null> => {
      const cleanTitle = title.trim();
      if (!cleanTitle) return null;

      const newItem: TodoItem = {
        id: `todo_${Date.now()}`,
        title: cleanTitle,
        description: description.trim(),
        completed: false,
        status: "active",
        linkedSessionId: linkedSessionId || undefined,
        createdAt: Date.now(),
      };

      const updated = [newItem, ...todos];
      setTodos(updated);
      await AppStorage.saveTodos(updated);
      return newItem;
    },
    [todos],
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const updated: TodoItem[] = todos.map((t) => {
        if (t.id === id) {
          const nextStatus: TodoStatus = t.status === "active" ? "completed" : "active";
          return {
            ...t,
            status: nextStatus,
            completed: nextStatus === "completed",
            completedAt: nextStatus === "completed" ? Date.now() : undefined,
          };
        }
        return t;
      });

      setTodos(updated);
      await AppStorage.saveTodos(updated);
    },
    [todos],
  );

  const completeTodo = useCallback(
    async (id: string) => {
      const updated = todos.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed" as const,
              completed: true,
              completedAt: Date.now(),
            }
          : t,
      );
      setTodos(updated);
      await AppStorage.saveTodos(updated);
    },
    [todos],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      // Mark as deleted rather than physically removing to preserve history
      const updated = todos.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "deleted" as const,
              deletedAt: Date.now(),
            }
          : t,
      );
      setTodos(updated);
      await AppStorage.saveTodos(updated);
    },
    [todos],
  );

  const restoreTodo = useCallback(
    async (id: string) => {
      const updated = todos.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "active" as const,
              completed: false,
              deletedAt: undefined,
            }
          : t,
      );
      setTodos(updated);
      await AppStorage.saveTodos(updated);
    },
    [todos],
  );

  const permanentlyDeleteTodo = useCallback(
    async (id: string) => {
      const updated = todos.filter((t) => t.id !== id);
      setTodos(updated);
      await AppStorage.saveTodos(updated);
    },
    [todos],
  );

  return {
    todos,
    activeTodos,
    completedTodos,
    deletedTodos,
    loading,
    addTodo,
    toggleTodo,
    completeTodo,
    deleteTodo,
    restoreTodo,
    permanentlyDeleteTodo,
    refresh: loadTodos,
  };
}
