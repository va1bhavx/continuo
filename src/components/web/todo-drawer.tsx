import { useEffect, useState } from "react";
import { X, CheckCircle2, Circle, Trash2, Link } from "lucide-react";
import { AppStorage } from "../../lib/storage";
import type { TodoItem } from "../../lib/storage";
import type { FocusSession } from "../../lib/data/mock-data";

interface TodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TodoDrawer({ isOpen, onClose }: TodoDrawerProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [history, setHistory] = useState<FocusSession[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkedSessionId, setLinkedSessionId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const [savedTodos, savedHistory] = await Promise.all([
          AppStorage.getTodos(),
          AppStorage.getHistory(),
        ]);
        setTodos(savedTodos);
        setHistory(savedHistory);
      } catch (e) {
        console.error("Failed to load Todo drawer data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const newItem: TodoItem = {
      id: `todo_${Date.now()}`,
      title: cleanTitle,
      description: description.trim(),
      completed: false,
      linkedSessionId: linkedSessionId || undefined,
      createdAt: Date.now(),
    };

    const updated = [newItem, ...todos];
    setTodos(updated);
    await AppStorage.saveTodos(updated);

    setTitle("");
    setDescription("");
    setLinkedSessionId("");
  };

  const handleToggleTodo = async (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTodos(updated);
    await AppStorage.saveTodos(updated);
  };

  const handleDeleteTodo = async (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    await AppStorage.saveTodos(updated);
  };

  if (!isOpen) return null;

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="fixed inset-0 z-50 flex justify-start pointer-events-none">
      {/* Click-away backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-xs pointer-events-auto"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full h-screen bg-surface/95 backdrop-blur-lg border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto animate-slide-right text-shadow-none text-left">
        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Todo List</h2>
            <p className="text-[10px] text-text-secondary">
              Organize your goals & connect them to focus logs
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="space-y-2.5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              required
              className="w-full h-8 px-2.5 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="w-full p-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
            />

            {/* Session selector */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider font-semibold text-text-secondary">
                Link to Focus Session
              </label>
              <select
                value={linkedSessionId}
                onChange={(e) => setLinkedSessionId(e.target.value)}
                className="w-full h-8 px-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="">Independent Task</option>
                {history.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} (
                    {new Date(session.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    )
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-8 rounded bg-accent text-accent-text! font-medium text-xs hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              Add Task
            </button>
          </form>

          {/* Task List */}
          {loading ? (
            <div className="text-center text-xs text-text-secondary py-8">
              Loading tasks...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center text-xs text-text-secondary py-12 space-y-1 bg-surface-hover/10 rounded-lg p-4 border border-dashed border-border/40">
              <p className="font-semibold text-text-primary">No tasks found</p>
              <p className="text-[10px]">
                Create checklist items to track your focus intentions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Uncompleted Tasks */}
              {activeTodos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-accent">
                    Active ({activeTodos.length})
                  </h3>
                  <div className="space-y-2">
                    {activeTodos.map((todo) => {
                      const linkedSession = history.find(
                        (s) => s.id === todo.linkedSessionId,
                      );
                      return (
                        <div
                          key={todo.id}
                          className="p-3 rounded-lg bg-surface/50 border border-border/40 hover:border-border-strong/40 transition-all flex items-start gap-2.5"
                        >
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className="text-text-secondary hover:text-accent transition-colors self-start mt-0.5 border-0 bg-transparent cursor-pointer p-0"
                          >
                            <Circle size={15} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-text-primary leading-snug break-words">
                              {todo.title}
                            </h4>
                            {todo.description && (
                              <p className="text-[10px] text-text-secondary mt-0.5 leading-normal break-words">
                                {todo.description}
                              </p>
                            )}
                            {linkedSession && (
                              <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                                <Link size={8} />
                                <span className="truncate max-w-[150px]">
                                  {linkedSession.title}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-text-secondary hover:text-danger transition-colors self-start border-0 bg-transparent cursor-pointer p-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTodos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-text-secondary">
                    Completed ({completedTodos.length})
                  </h3>
                  <div className="space-y-2 opacity-60">
                    {completedTodos.map((todo) => {
                      const linkedSession = history.find(
                        (s) => s.id === todo.linkedSessionId,
                      );
                      return (
                        <div
                          key={todo.id}
                          className="p-3 rounded-lg bg-surface/30 border border-border/30 flex items-start gap-2.5"
                        >
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className="text-accent hover:text-text-secondary transition-colors self-start mt-0.5 border-0 bg-transparent cursor-pointer p-0"
                          >
                            <CheckCircle2
                              size={15}
                              className="fill-accent/10"
                            />
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-text-secondary line-through leading-snug break-words">
                              {todo.title}
                            </h4>
                            {todo.description && (
                              <p className="text-[10px] text-text-tertiary mt-0.5 leading-normal line-through break-words">
                                {todo.description}
                              </p>
                            )}
                            {linkedSession && (
                              <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-medium text-text-secondary bg-surface-hover/40 px-2 py-0.5 rounded border border-border/30">
                                <Link size={8} />
                                <span className="truncate max-w-[150px]">
                                  {linkedSession.title}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-text-secondary hover:text-danger transition-colors self-start border-0 bg-transparent cursor-pointer p-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
