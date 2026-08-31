import type { FocusSession } from "../data/mock-data";
import { StorageService } from "./chrome-storage";

export interface ActiveSession {
  task: string;
  startedAt: number;
  focusState: "running" | "summary";
  sessionStatus?: "completed" | "stopped";
  currentSessionId?: string;
  isPaused?: boolean;
  accumulatedSeconds?: number;
}

export interface AppSettings {
  clockShowSeconds: boolean;
  clock24Hour: boolean;
  tabTitleTimer: boolean;
  soundAlert: boolean;
}

export interface FavoriteLink {
  id: string;
  label: string;
  url: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  linkedSessionId?: string;
  createdAt: number;
}

export interface ScheduleSlot {
  id: string;
  time: string;
  title: string;
  description: string;
  notified?: boolean;
  type?: "daily" | "once";
}

const KEYS = {
  HISTORY: "focus_history",
  SETTINGS: "app_settings",
  WALLPAPER: "current_wallpaper",
  LINKS: "favorite_links",
  TODOS: "todo_list_items",
  SCHEDULE: "schedule_slots",
};

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
    const updated = history.map(s => {
      if (s.id === id) {
        const existing = s.accomplishments || (s.accomplishment ? [s.accomplishment] : []);
        const newAccomplishments = [...existing, note];
        return {
          ...s,
          accomplishment: newAccomplishments.join("\n"),
          accomplishments: newAccomplishments
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
    return StorageService.get<AppSettings>(KEYS.SETTINGS, {
      clockShowSeconds: true,
      clock24Hour: false,
      tabTitleTimer: true,
      soundAlert: true,
    });
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await StorageService.set(KEYS.SETTINGS, settings);
  },

  async getWallpaper(): Promise<string> {
    return StorageService.get<string>(KEYS.WALLPAPER, "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp");
  },

  async saveWallpaper(path: string): Promise<void> {
    await StorageService.set(KEYS.WALLPAPER, path);
  },

  async getActiveSession(): Promise<ActiveSession | null> {
    return StorageService.get<ActiveSession | null>("active_session", null);
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
    return StorageService.get<TodoItem[]>(KEYS.TODOS, []);
  },

  async saveTodos(todos: TodoItem[]): Promise<void> {
    await StorageService.set(KEYS.TODOS, todos);
  },

  async getSchedule(): Promise<ScheduleSlot[]> {
    return StorageService.get<ScheduleSlot[]>(KEYS.SCHEDULE, []);
  },

  async saveSchedule(schedule: ScheduleSlot[]): Promise<void> {
    await StorageService.set(KEYS.SCHEDULE, schedule);
  },
};
