import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ExternalLink, StickyNote, X } from "lucide-react";
import type { TodoItem } from "../../lib/storage";

interface TodoNotesWidgetProps {
  activeTodos: TodoItem[];
  onCompleteTodo: (id: string) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onAddTodo: (title: string) => Promise<TodoItem | null>;
  onOpenFullDrawer: () => void;
}

export default function TodoNotesWidget({
  activeTodos,
  onCompleteTodo,
  onDeleteTodo,
  onAddTodo,
  onOpenFullDrawer,
}: TodoNotesWidgetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when quick add is opened
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // If no active todos, the widget is completely invisible
  if (activeTodos.length === 0) {
    return null;
  }

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTitle.trim();
    if (!clean) return;

    await onAddTodo(clean);
    setNewTitle("");
    setIsAdding(false);
  };

  const handleCheck = async (id: string) => {
    // Add to completing state for instantaneous smooth visual feedback
    setCompletingIds((prev) => new Set(prev).add(id));
    setTimeout(async () => {
      await onCompleteTodo(id);
      setCompletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 220);
  };

  return (
    <aside
      className="fixed bottom-14 left-4 z-40 w-72 max-w-[calc(100vw-2rem)] bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col animate-scale-in text-shadow-none text-left overflow-hidden select-none transition-all duration-200"
      aria-label="Active Tasks Note"
    >
      {/* Note Header */}
      <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between bg-surface/50">
        <div className="flex items-center gap-1.5">
          <StickyNote size={13} className="text-accent shrink-0" />
          <span className="text-[11px] font-bold text-text-primary tracking-tight">
            Active Tasks
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-accent/15 text-accent text-[9px] font-bold border border-accent/25">
            {activeTodos.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setIsAdding((prev) => !prev)}
            className={`p-1 rounded transition-colors cursor-pointer border-0 bg-transparent ${
              isAdding
                ? "text-accent bg-accent/10"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`}
            title={isAdding ? "Cancel" : "Quick add task"}
          >
            {isAdding ? <X size={13} /> : <Plus size={13} />}
          </button>

          <button
            type="button"
            onClick={onOpenFullDrawer}
            className="p-1 rounded text-text-secondary hover:text-accent hover:bg-surface-hover transition-colors cursor-pointer border-0 bg-transparent"
            title="Open tasks drawer"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Inline Quick Add Form */}
      {isAdding && (
        <form
          onSubmit={handleQuickAdd}
          className="p-2 border-b border-border/50 bg-surface-2/40 flex items-center gap-1.5 animate-slide-up-subtle"
        >
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewTitle("");
              }
            }}
            placeholder="Jot down a quick task..."
            className="flex-1 h-7 px-2 text-xs bg-surface border border-border rounded text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="h-7 px-2.5 bg-accent text-accent-text! text-[10px] font-bold rounded hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0 transition-colors shrink-0"
          >
            Add
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="max-h-52 overflow-y-auto p-2 space-y-1">
        {activeTodos.map((todo) => {
          const isCompleting = completingIds.has(todo.id);
          return (
            <div
              key={todo.id}
              className={`group flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-surface-hover/60 ${
                isCompleting ? "opacity-50 scale-95" : ""
              }`}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => handleCheck(todo.id)}
                disabled={isCompleting}
                className="text-text-tertiary hover:text-accent transition-colors cursor-pointer border-0 bg-transparent p-0 shrink-0 flex items-center justify-center"
                title="Mark complete"
              >
                {isCompleting ? (
                  <CheckCircle2 size={14} className="text-accent animate-pulse" />
                ) : (
                  <Circle size={14} />
                )}
              </button>

              {/* Title */}
              <span
                className={`flex-1 min-w-0 text-xs text-text-primary font-medium truncate leading-tight select-text ${
                  isCompleting ? "line-through text-text-tertiary" : ""
                }`}
                title={todo.title}
              >
                {todo.title}
              </span>

              {/* Delete button (shows on hover) */}
              <button
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all cursor-pointer border-0 bg-transparent p-0.5 shrink-0"
                title="Delete task"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Subtle Footer Link to Full Drawer */}
      <div className="px-3 py-1.5 border-t border-border/40 bg-surface/30 flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary">
          {activeTodos.length === 1 ? "1 active task" : `${activeTodos.length} active tasks`}
        </span>
        <button
          type="button"
          onClick={onOpenFullDrawer}
          className="text-[10px] font-semibold text-text-secondary hover:text-accent transition-colors cursor-pointer border-0 bg-transparent"
        >
          View all →
        </button>
      </div>
    </aside>
  );
}
