import type { ActiveSession } from "../lib/storage";

/**
 * Calculates the exact canonical elapsed seconds for a session.
 * For active sessions: elapsed = accumulatedSeconds + (now - startedAt) (or accumulatedSeconds if paused)
 * For completed sessions (summary): elapsed = endedAt - startedAt (never relies on current time)
 */
export function calculateElapsedSeconds(
  session: ActiveSession | null,
  now: number = Date.now(),
): number {
  if (!session) return 0;

  if (session.focusState === "summary") {
    if (typeof session.endedAt === "number" && typeof session.startedAt === "number") {
      return Math.max(0, Math.floor((session.endedAt - session.startedAt) / 1000));
    }
    return session.accumulatedSeconds || 0;
  }

  if (session.isPaused) {
    return session.accumulatedSeconds || 0;
  }

  const baseSeconds = session.accumulatedSeconds || 0;
  const currentSegment = Math.max(0, Math.floor((now - session.startedAt) / 1000));
  return baseSeconds + currentSegment;
}

export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDurationFriendly(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  if (safeSeconds === 0) return "0s";
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(" ");
}

export function formatTabTitleTimer(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function truncateSessionTitle(title: string, maxLength: number = 32): string {
  const clean = (title || "").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
}

export interface TabTitleOptions {
  session: ActiveSession | null;
  seconds: number;
  showSessionName: boolean;
  showSessionTimer: boolean;
}

export function getTabTitle({
  session,
  seconds,
  showSessionName,
  showSessionTimer,
}: TabTitleOptions): string {
  if (!session || session.focusState !== "running") {
    return "Continuo";
  }

  const name = truncateSessionTitle(session.task || "Focus Session", 32);
  const timer = formatTabTitleTimer(seconds);

  if (showSessionName && showSessionTimer) {
    return `${name} · ${timer}`;
  }
  if (showSessionName && !showSessionTimer) {
    return name;
  }
  if (!showSessionName && showSessionTimer) {
    return timer;
  }
  return "Continuo";
}
