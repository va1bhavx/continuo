import type { FocusSession } from "../data/mock-data";
import { StorageService } from "./chrome-storage";

export interface ActiveSession {
  task: string;
  startedAt: number;
  focusState: "running" | "summary";
  sessionStatus?: "completed" | "stopped";
  currentSessionId?: string;
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

const KEYS = {
  HISTORY: "focus_history",
  SETTINGS: "app_settings",
  WALLPAPER: "current_wallpaper",
  LINKS: "favorite_links",
};

export const AppStorage = {
  async getHistory(): Promise<FocusSession[]> {
    return StorageService.get<FocusSession[]>(KEYS.HISTORY, []);
  },

  async saveSession(session: FocusSession): Promise<void> {
    const history = await this.getHistory();
    await StorageService.set(KEYS.HISTORY, [session, ...history]);
  },

  async updateSessionAccomplishment(id: string, accomplishment: string): Promise<void> {
    const history = await this.getHistory();
    const updated = history.map(s => s.id === id ? { ...s, accomplishment } : s);
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
    return StorageService.get<FavoriteLink[]>(KEYS.LINKS, [
      { id: "1", label: "GitHub", url: "https://github.com" },
      { id: "2", label: "LinkedIn", url: "https://linkedin.com" },
      { id: "3", label: "Twitter", url: "https://twitter.com" },
    ]);
  },

  async saveLinks(links: FavoriteLink[]): Promise<void> {
    await StorageService.set(KEYS.LINKS, links);
  },
};
