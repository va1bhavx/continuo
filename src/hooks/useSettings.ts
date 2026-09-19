import { useEffect, useState, useCallback } from "react";
import { AppStorage, DEFAULT_SETTINGS } from "../lib/storage";
import type { AppSettings } from "../lib/storage";
import { checkCustomizationAchievements } from "../lib/storage/achievements-helper";

declare const chrome: any;

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AppStorage.getSettings();
      setSettings(saved);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.app_settings) {
        setSettings(changes.app_settings.newValue);
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "app_settings") {
        setSettings(customEvent.detail.newValue);
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      return () => window.removeEventListener("local-storage-update", handleLocalUpdate);
    }
  }, []);

  const updateSetting = useCallback(
    async (key: keyof AppSettings, value: boolean) => {
      const updated = { ...settings, [key]: value };
      // Keep legacy tabTitleTimer in sync with showSessionTimerInTitle
      if (key === "showSessionTimerInTitle") {
        updated.tabTitleTimer = value;
      } else if (key === "tabTitleTimer") {
        updated.showSessionTimerInTitle = value;
      }

      setSettings(updated);
      await AppStorage.saveSettings(updated);
      await checkCustomizationAchievements();
    },
    [settings],
  );

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await AppStorage.saveSettings(DEFAULT_SETTINGS);
    await checkCustomizationAchievements();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    resetSettings,
    refresh: loadSettings,
  };
}
