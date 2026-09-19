import { useEffect, useState, useCallback, useMemo } from "react";
import { AppStorage } from "../lib/storage";
import type { ScheduleSlot } from "../lib/storage";

declare const chrome: any;

export function useSchedules() {
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSchedule = useCallback(async () => {
    try {
      const saved = await AppStorage.getSchedule();
      setSchedules(saved);
    } catch (e) {
      console.error("Failed to load schedules:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.schedule_slots) {
        loadSchedule();
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "schedule_slots") {
        loadSchedule();
      }
    };

    const handleCustomScheduleUpdate = () => {
      loadSchedule();
    };

    window.addEventListener("schedule-update", handleCustomScheduleUpdate);

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
        window.removeEventListener("schedule-update", handleCustomScheduleUpdate);
      };
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      return () => {
        window.removeEventListener("local-storage-update", handleLocalUpdate);
        window.removeEventListener("schedule-update", handleCustomScheduleUpdate);
      };
    }
  }, [loadSchedule]);

  // Upcoming: scheduled slots sorted by time
  const upcomingSlots = useMemo(() => {
    return schedules
      .filter((s) => s.status === "scheduled")
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [schedules]);

  // History: completed, missed, or cancelled slots
  const historySlots = useMemo(() => {
    return schedules
      .filter(
        (s) =>
          s.status === "completed" ||
          s.status === "missed" ||
          s.status === "cancelled",
      )
      .sort((a, b) => (b.completedAt || b.createdAt || 0) - (a.completedAt || a.createdAt || 0));
  }, [schedules]);

  const addSlot = useCallback(
    async (
      time: string,
      title: string,
      description: string = "",
      type: "daily" | "once" = "daily",
    ): Promise<ScheduleSlot | null> => {
      const cleanTitle = title.trim();
      if (!cleanTitle || !time) return null;

      const newSlot: ScheduleSlot = {
        id: `slot_${Date.now()}`,
        time,
        title: cleanTitle,
        description: description.trim(),
        notified: false,
        type,
        status: "scheduled",
        createdAt: Date.now(),
      };

      const updated = [...schedules, newSlot].sort((a, b) =>
        a.time.localeCompare(b.time),
      );
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
      return newSlot;
    },
    [schedules],
  );

  const completeSlot = useCallback(
    async (id: string) => {
      const updated = schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "completed" as const,
              completedAt: Date.now(),
            }
          : s,
      );
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
    },
    [schedules],
  );

  const cancelSlot = useCallback(
    async (id: string) => {
      const updated = schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "cancelled" as const,
              completedAt: Date.now(),
            }
          : s,
      );
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
    },
    [schedules],
  );

  const deleteSlot = useCallback(
    async (id: string) => {
      // Instead of discarding history, mark as cancelled so it moves to schedule history
      const updated = schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "cancelled" as const,
              completedAt: Date.now(),
            }
          : s,
      );
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
    },
    [schedules],
  );

  const restoreSlot = useCallback(
    async (id: string) => {
      const updated = schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "scheduled" as const,
              notified: false,
              completedAt: undefined,
            }
          : s,
      );
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
    },
    [schedules],
  );

  const permanentlyDeleteSlot = useCallback(
    async (id: string) => {
      const updated = schedules.filter((s) => s.id !== id);
      setSchedules(updated);
      await AppStorage.saveSchedule(updated);
      window.dispatchEvent(new CustomEvent("schedule-update"));
    },
    [schedules],
  );

  return {
    schedules,
    upcomingSlots,
    historySlots,
    loading,
    addSlot,
    completeSlot,
    cancelSlot,
    deleteSlot,
    restoreSlot,
    permanentlyDeleteSlot,
    refresh: loadSchedule,
  };
}
