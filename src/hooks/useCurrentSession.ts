import { useEffect, useState, useCallback, useRef } from "react";
import { AppStorage } from "../lib/storage";
import type { ActiveSession, FocusSession } from "../lib/storage";
import { calculateElapsedSeconds } from "../utils/session-timing";
import { checkFocusAchievements, checkHistoryAchievements } from "../lib/storage/achievements-helper";

declare const chrome: any;

export function useCurrentSession() {
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const [sessionAccomplishments, setSessionAccomplishments] = useState<string[]>([]);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep a ref to session so callbacks always see the freshest session without re-binding
  const sessionRef = useRef<ActiveSession | null>(null);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const loadActiveSession = useCallback(async () => {
    try {
      const active = await AppStorage.getActiveSession();
      setSession(active);
      setNow(Date.now());

      if (active?.focusState === "summary" && active.currentSessionId) {
        try {
          const history = await AppStorage.getHistory();
          const current = history.find((s) => s.id === active.currentSessionId);
          if (current) {
            const list =
              current.accomplishments ||
              (current.accomplishment ? [current.accomplishment] : []);
            setSessionAccomplishments(list);
          }
        } catch (err) {
          console.error("Failed to load accomplishments:", err);
        }
      }
    } catch (e) {
      console.error("Failed to load active session:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadActiveSession();
  }, [loadActiveSession]);

  // Sync across tabs via chrome.storage.onChanged or local-storage-update
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.active_session) {
        const next = changes.active_session.newValue as ActiveSession | null;
        setSession(next);
        setNow(Date.now());
        if (next?.focusState === "summary" && next.currentSessionId) {
          AppStorage.getHistory().then((history) => {
            const current = history.find((s) => s.id === next.currentSessionId);
            if (current) {
              setSessionAccomplishments(
                current.accomplishments ||
                  (current.accomplishment ? [current.accomplishment] : []),
              );
            }
          });
        }
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "active_session") {
        const next = customEvent.detail.newValue as ActiveSession | null;
        setSession(next);
        setNow(Date.now());
        if (next?.focusState === "summary" && next.currentSessionId) {
          AppStorage.getHistory().then((history) => {
            const current = history.find((s) => s.id === next.currentSessionId);
            if (current) {
              setSessionAccomplishments(
                current.accomplishments ||
                  (current.accomplishment ? [current.accomplishment] : []),
              );
            }
          });
        }
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

  // Single interval ticking ONLY when active & running (not paused)
  useEffect(() => {
    if (!session || session.focusState !== "running" || session.isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
      }
    };
    const handleFocus = () => setNow(Date.now());

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [session]);

  // Canonical seconds derived synchronously from canonical session and now
  const seconds = calculateElapsedSeconds(session, now);

  const startSession = useCallback(async (taskTitle: string) => {
    const cleanTask = taskTitle.trim();
    if (!cleanTask) return;

    const startTime = Date.now();
    const newSession: ActiveSession = {
      task: cleanTask,
      startedAt: startTime,
      focusState: "running",
      isPaused: false,
      accumulatedSeconds: 0,
    };

    setSession(newSession);
    setNow(startTime);
    setSessionAccomplishments([]);
    setIsNoteSaved(false);

    await AppStorage.setActiveSession(newSession);
  }, []);

  const pauseSession = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.focusState !== "running" || current.isPaused) return;

    const pauseTime = Date.now();
    const totalElapsed = calculateElapsedSeconds(current, pauseTime);

    const updated: ActiveSession = {
      ...current,
      isPaused: true,
      pausedAt: pauseTime,
      accumulatedSeconds: totalElapsed,
    };

    setSession(updated);
    setNow(pauseTime);
    await AppStorage.setActiveSession(updated);
  }, []);

  const resumeSession = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || current.focusState !== "running" || !current.isPaused) return;

    const resumeTime = Date.now();
    const updated: ActiveSession = {
      ...current,
      isPaused: false,
      pausedAt: undefined,
      startedAt: resumeTime,
      accumulatedSeconds: current.accumulatedSeconds || 0,
    };

    setSession(updated);
    setNow(resumeTime);
    await AppStorage.setActiveSession(updated);
  }, []);

  const endSession = useCallback(
    async (status: "completed" | "stopped"): Promise<FocusSession> => {
      const current = sessionRef.current;
      const endTime = Date.now();
      const finalDuration = calculateElapsedSeconds(current, endTime);
      const sessionStartedAt = endTime - finalDuration * 1000;
      const sessionId = `session_${endTime}`;
      const taskTitle = current?.task || "Focus Session";

      const sessionData: FocusSession = {
        id: sessionId,
        title: taskTitle,
        startedAt: sessionStartedAt,
        endedAt: endTime,
        status,
        createdAt: endTime,
      };

      const summarySession: ActiveSession = {
        task: taskTitle,
        startedAt: sessionStartedAt,
        endedAt: endTime,
        focusState: "summary",
        sessionStatus: status,
        currentSessionId: sessionId,
        accumulatedSeconds: finalDuration,
      };

      setSession(summarySession);
      setNow(endTime);

      await AppStorage.saveSession(sessionData);
      await AppStorage.setActiveSession(summarySession);
      await checkFocusAchievements();

      return sessionData;
    },
    [],
  );

  const saveAccomplishment = useCallback(async (note: string) => {
    const cleanNote = note.trim();
    const current = sessionRef.current;
    if (!cleanNote || !current?.currentSessionId) return;

    await AppStorage.updateSessionAccomplishment(current.currentSessionId, cleanNote);
    setSessionAccomplishments((prev) => [...prev, cleanNote]);
    setIsNoteSaved(true);

    setTimeout(() => {
      setIsNoteSaved(false);
    }, 1500);

    await checkHistoryAchievements();
  }, []);

  const startAnother = useCallback(async () => {
    setSession(null);
    setSessionAccomplishments([]);
    setIsNoteSaved(false);
    await AppStorage.clearActiveSession();
  }, []);

  return {
    session,
    focusState: session ? session.focusState : "idle",
    task: session?.task || "",
    isPaused: !!session?.isPaused,
    seconds,
    sessionStatus: session?.sessionStatus || "completed",
    currentSessionId: session?.currentSessionId || null,
    sessionAccomplishments,
    isNoteSaved,
    loading,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    saveAccomplishment,
    startAnother,
    refresh: loadActiveSession,
  };
}
