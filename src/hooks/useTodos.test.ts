// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { AppStorage } from "../lib/storage";

describe("Todo storage and status lifecycle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds an active todo and persists to storage", async () => {
    const initial = await AppStorage.getTodos();
    expect(initial).toHaveLength(0);

    const newTodo = {
      id: "todo_1",
      title: "Complete Movidict API",
      description: "Build auth endpoints",
      completed: false,
      status: "active" as const,
      createdAt: Date.now(),
    };

    await AppStorage.saveTodos([newTodo]);

    const loaded = await AppStorage.getTodos();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("todo_1");
    expect(loaded[0].status).toBe("active");
    expect(loaded[0].completed).toBe(false);
  });

  it("marks a todo as completed and retains it in storage", async () => {
    const todo = {
      id: "todo_1",
      title: "Write documentation",
      description: "",
      completed: false,
      status: "active" as const,
      createdAt: Date.now(),
    };
    await AppStorage.saveTodos([todo]);

    const completed = [{
      ...todo,
      status: "completed" as const,
      completed: true,
      completedAt: Date.now(),
    }];
    await AppStorage.saveTodos(completed);

    const loaded = await AppStorage.getTodos();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].status).toBe("completed");
    expect(loaded[0].completed).toBe(true);
  });

  it("marks a todo as deleted without physically removing it from storage (history preserved)", async () => {
    const todo = {
      id: "todo_1",
      title: "Old discarded task",
      description: "",
      completed: false,
      status: "active" as const,
      createdAt: Date.now(),
    };
    await AppStorage.saveTodos([todo]);

    const markedDeleted = [{
      ...todo,
      status: "deleted" as const,
      deletedAt: Date.now(),
    }];
    await AppStorage.saveTodos(markedDeleted);

    const loaded = await AppStorage.getTodos();
    // Verify it is STILL in persistent storage as history!
    expect(loaded).toHaveLength(1);
    expect(loaded[0].status).toBe("deleted");
    expect(loaded[0].deletedAt).toBeDefined();

    // Verify active filter excludes it
    const active = loaded.filter((t) => t.status === "active");
    expect(active).toHaveLength(0);

    // Verify deleted filter includes it
    const deleted = loaded.filter((t) => t.status === "deleted");
    expect(deleted).toHaveLength(1);
    expect(deleted[0].title).toBe("Old discarded task");
  });
});
