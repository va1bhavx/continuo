import { useEffect, useState, useCallback } from "react";
import { AppStorage } from "../lib/storage";
import type { FocusSession } from "../lib/data/mock-data";

declare const chrome: any;

export function useSessionHistory() {
  const [history, setHistory] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const data = await AppStorage.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.focus_history) {
        setHistory(changes.focus_history.newValue || []);
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "focus_history") {
        setHistory(customEvent.detail.newValue || []);
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

  const clearHistory = useCallback(async () => {
    await AppStorage.clearHistory();
    setHistory([]);
  }, []);

  return {
    history,
    loading,
    refresh: loadHistory,
    clearHistory,
  };
}
