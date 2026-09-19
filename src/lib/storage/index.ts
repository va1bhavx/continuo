import type { FocusSession } from "../data/mock-data";
export type { FocusSession };
import { StorageService } from "./chrome-storage";

export interface ActiveSession {
  task: string;
  startedAt: number;
  focusState: "running" | "summary";
  sessionStatus?: "completed" | "stopped";
  currentSessionId?: string;
  isPaused?: boolean;
  pausedAt?: number;
  accumulatedSeconds?: number;
  endedAt?: number;
}

export interface AppSettings {
  clockShowSeconds: boolean;
  clock24Hour: boolean;
  tabTitleTimer?: boolean; // legacy compatibility
  showSessionTimerInTitle: boolean;
  showSessionNameInTitle: boolean;
  soundAlert: boolean;
}

export interface FavoriteLink {
  id: string;
  label: string;
  url: string;
  avatarType?: "auto" | "initials" | "icon";
  avatarColor?: string;
}

export type TodoStatus = "active" | "completed" | "deleted";

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: TodoStatus;
  linkedSessionId?: string;
  createdAt: number;
  completedAt?: number;
  deletedAt?: number;
}

export type ScheduleStatus = "scheduled" | "completed" | "missed" | "cancelled";

export interface ScheduleSlot {
  id: string;
  time: string;
  title: string;
  description: string;
  notified?: boolean;
  type?: "daily" | "once";
  status: ScheduleStatus;
  date?: string;
  createdAt?: number;
  completedAt?: number;
}

export const KEYS = {
  HISTORY: "focus_history",
  SETTINGS: "app_settings",
  WALLPAPER: "current_wallpaper",
  LINKS: "favorite_links",
  TODOS: "todo_list_items",
  SCHEDULE: "schedule_slots",
};

export const DEFAULT_SETTINGS: AppSettings = {
  clockShowSeconds: true,
  clock24Hour: false,
  tabTitleTimer: true,
  showSessionTimerInTitle: true,
  showSessionNameInTitle: true,
  soundAlert: true,
};

export function normalizeSettings(raw: Partial<AppSettings> | null | undefined): AppSettings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  const timerEnabled = raw.showSessionTimerInTitle ?? raw.tabTitleTimer ?? DEFAULT_SETTINGS.showSessionTimerInTitle;
  return {
    clockShowSeconds: raw.clockShowSeconds ?? DEFAULT_SETTINGS.clockShowSeconds,
    clock24Hour: raw.clock24Hour ?? DEFAULT_SETTINGS.clock24Hour,
    tabTitleTimer: timerEnabled,
    showSessionTimerInTitle: timerEnabled,
    showSessionNameInTitle: raw.showSessionNameInTitle ?? DEFAULT_SETTINGS.showSessionNameInTitle,
    soundAlert: raw.soundAlert ?? DEFAULT_SETTINGS.soundAlert,
  };
}

export function normalizeTodo(raw: any): TodoItem {
  const isCompleted = typeof raw.completed === "boolean" ? raw.completed : raw.status === "completed";
  let status: TodoStatus = raw.status;
  if (!status || (status !== "active" && status !== "completed" && status !== "deleted")) {
    status = isCompleted ? "completed" : "active";
  }
  return {
    id: raw.id || `todo_${Date.now()}`,
    title: raw.title || "",
    description: raw.description || "",
    completed: status === "completed",
    status,
    linkedSessionId: raw.linkedSessionId || undefined,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    completedAt: raw.completedAt,
    deletedAt: raw.deletedAt,
  };
}

export function normalizeSchedule(raw: any): ScheduleSlot {
  let status: ScheduleStatus = raw.status;
  if (!status || (status !== "scheduled" && status !== "completed" && status !== "missed" && status !== "cancelled")) {
    if (raw.type === "once" && raw.notified) {
      status = "completed";
    } else {
      status = "scheduled";
    }
  }
  return {
    id: raw.id || `slot_${Date.now()}`,
    time: raw.time || "09:00",
    title: raw.title || "",
    description: raw.description || "",
    notified: !!raw.notified,
    type: raw.type === "once" ? "once" : "daily",
    status,
    date: raw.date,
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    completedAt: raw.completedAt,
  };
}

export function normalizeActiveSession(raw: any): ActiveSession | null {
  if (!raw || typeof raw !== "object" || !raw.task) return null;
  const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : Date.now();
  const accumulated = typeof raw.accumulatedSeconds === "number" ? raw.accumulatedSeconds : 0;
  let endedAt = typeof raw.endedAt === "number" ? raw.endedAt : undefined;
  if (raw.focusState === "summary" && !endedAt) {
    endedAt = startedAt + accumulated * 1000;
  }
  return {
    task: raw.task,
    startedAt,
    focusState: raw.focusState === "summary" ? "summary" : "running",
    sessionStatus: raw.sessionStatus || "completed",
    currentSessionId: raw.currentSessionId,
    isPaused: !!raw.isPaused,
    pausedAt: raw.pausedAt,
    accumulatedSeconds: accumulated,
    endedAt,
  };
}

export const AppStorage = {
  async getHistory(): Promise<FocusSession[]> {
    return StorageService.get<FocusSession[]>(KEYS.HISTORY, []);
  },

  async saveSession(session: FocusSession): Promise<void> {
    const history = await this.getHistory();
    await StorageService.set(KEYS.HISTORY, [session, ...history]);
  },

  async updateSessionAccomplishment(id: string, note: string): Promise<void> {
    const history = await this.getHistory();
    const updated = history.map((s) => {
      if (s.id === id) {
        const existing = s.accomplishments || (s.accomplishment ? [s.accomplishment] : []);
        const newAccomplishments = [...existing, note];
        return {
          ...s,
          accomplishment: newAccomplishments.join("\n"),
          accomplishments: newAccomplishments,
        };
      }
      return s;
    });
    await StorageService.set(KEYS.HISTORY, updated);
  },

  async clearHistory(): Promise<void> {
    await StorageService.remove(KEYS.HISTORY);
  },

  async getSettings(): Promise<AppSettings> {
    const raw = await StorageService.get<Partial<AppSettings>>(KEYS.SETTINGS, DEFAULT_SETTINGS);
    return normalizeSettings(raw);
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await StorageService.set(KEYS.SETTINGS, normalizeSettings(settings));
  },

  async getWallpaper(): Promise<string> {
    return StorageService.get<string>(KEYS.WALLPAPER, "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp");
  },

  async saveWallpaper(path: string): Promise<void> {
    await StorageService.set(KEYS.WALLPAPER, path);
  },

  async getActiveSession(): Promise<ActiveSession | null> {
    const raw = await StorageService.get<ActiveSession | null>("active_session", null);
    return normalizeActiveSession(raw);
  },

  async setActiveSession(session: ActiveSession): Promise<void> {
    await StorageService.set("active_session", session);
  },

  async clearActiveSession(): Promise<void> {
    await StorageService.remove("active_session");
  },

  async getLinks(): Promise<FavoriteLink[]> {
    return StorageService.get<FavoriteLink[]>(KEYS.LINKS, []);
  },

  async saveLinks(links: FavoriteLink[]): Promise<void> {
    await StorageService.set(KEYS.LINKS, links);
  },

  async getUnlockedAchievements(): Promise<string[]> {
    return StorageService.get<string[]>("unlocked_achievements", []);
  },

  async unlockAchievement(id: string): Promise<void> {
    const unlocked = await this.getUnlockedAchievements();
    if (!unlocked.includes(id)) {
      await StorageService.set("unlocked_achievements", [...unlocked, id]);
    }
  },

  async clearAchievements(): Promise<void> {
    await StorageService.remove("unlocked_achievements");
  },

  async getTodos(): Promise<TodoItem[]> {
    const raw = await StorageService.get<any[]>(KEYS.TODOS, []);
    return raw.map(normalizeTodo);
  },

  async saveTodos(todos: TodoItem[]): Promise<void> {
    await StorageService.set(KEYS.TODOS, todos.map(normalizeTodo));
  },

  async getSchedule(): Promise<ScheduleSlot[]> {
    const raw = await StorageService.get<any[]>(KEYS.SCHEDULE, []);
    return raw.map(normalizeSchedule);
  },

  async saveSchedule(schedule: ScheduleSlot[]): Promise<void> {
    await StorageService.set(KEYS.SCHEDULE, schedule.map(normalizeSchedule));
  },
};
