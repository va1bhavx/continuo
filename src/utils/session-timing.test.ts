import { describe, it, expect } from "vitest";
import {
  calculateElapsedSeconds,
  formatTime,
  formatDurationFriendly,
  formatTabTitleTimer,
  truncateSessionTitle,
  getTabTitle,
} from "./session-timing";
import { formatDuration } from "../components/web/history";
import type { ActiveSession } from "../lib/storage";

describe("session-timing", () => {
  describe("calculateElapsedSeconds", () => {
    it("returns 0 when session is null", () => {
      expect(calculateElapsedSeconds(null)).toBe(0);
    });

    it("calculates live elapsed seconds for active running session", () => {
      const now = 1000000;
      const session: ActiveSession = {
        task: "Deep Work",
        startedAt: now - 45 * 1000,
        focusState: "running",
        isPaused: false,
        accumulatedSeconds: 0,
      };

      expect(calculateElapsedSeconds(session, now)).toBe(45);
    });

    it("accounts for accumulated seconds before current segment", () => {
      const now = 1000000;
      const session: ActiveSession = {
        task: "Deep Work",
        startedAt: now - 30 * 1000,
        focusState: "running",
        isPaused: false,
        accumulatedSeconds: 120,
      };

      expect(calculateElapsedSeconds(session, now)).toBe(150);
    });

    it("freezes elapsed time when session is paused", () => {
      const now = 1000000;
      const session: ActiveSession = {
        task: "Deep Work",
        startedAt: now - 500 * 1000,
        focusState: "running",
        isPaused: true,
        accumulatedSeconds: 200,
      };

      // Even if current time is far ahead, elapsed is frozen at accumulatedSeconds
      expect(calculateElapsedSeconds(session, now)).toBe(200);
      expect(calculateElapsedSeconds(session, now + 100000)).toBe(200);
    });

    it("returns fixed duration in summary state without increasing over time", () => {
      const start = 1000000;
      const end = start + 25 * 60 * 1000; // 25 minutes
      const session: ActiveSession = {
        task: "Build feature",
        startedAt: start,
        endedAt: end,
        focusState: "summary",
        sessionStatus: "completed",
        accumulatedSeconds: 25 * 60,
      };

      // Immediately after session ends
      expect(calculateElapsedSeconds(session, end)).toBe(25 * 60);

      // 4 hours later in a new tab: duration MUST NOT change or calculate against Date.now()!
      const fourHoursLater = end + 4 * 3600 * 1000;
      expect(calculateElapsedSeconds(session, fourHoursLater)).toBe(25 * 60);

      // Verify Home and History duration calculations match exactly
      const homeDurationFormatted = formatDurationFriendly(calculateElapsedSeconds(session, fourHoursLater));
      const historyDurationFormatted = formatDuration(session.startedAt, session.endedAt!);
      expect(homeDurationFormatted).toBe("25m");
      expect(historyDurationFormatted).toBe("25min");
    });
  });

  describe("formatTime", () => {
    it("formats seconds to HH:MM:SS format", () => {
      expect(formatTime(0)).toBe("00:00:00");
      expect(formatTime(125)).toBe("00:02:05");
      expect(formatTime(3665)).toBe("01:01:05");
    });
  });

  describe("formatTabTitleTimer", () => {
    it("formats minutes and seconds when under 1 hour", () => {
      expect(formatTabTitleTimer(0)).toBe("00:00");
      expect(formatTabTitleTimer(45)).toBe("00:45");
      expect(formatTabTitleTimer(1472)).toBe("24:32");
      expect(formatTabTitleTimer(2538)).toBe("42:18");
    });

    it("formats hours, minutes, and seconds when 1 hour or more", () => {
      expect(formatTabTitleTimer(3600)).toBe("1:00:00");
      expect(formatTabTitleTimer(3665)).toBe("1:01:05");
      expect(formatTabTitleTimer(5072)).toBe("1:24:32");
    });
  });

  describe("truncateSessionTitle", () => {
    it("returns short titles untouched", () => {
      expect(truncateSessionTitle("Build Movidict")).toBe("Build Movidict");
    });

    it("safely truncates long titles with ellipsis", () => {
      const longTitle = "This is a very long focus session task name that exceeds normal browser tab bounds";
      const truncated = truncateSessionTitle(longTitle, 30);
      expect(truncated.endsWith("...")).toBe(true);
      expect(truncated.length).toBeLessThanOrEqual(33);
    });
  });

  describe("getTabTitle (4 matrix states)", () => {
    const activeSession: ActiveSession = {
      task: "Build Movidict",
      startedAt: Date.now() - 2538 * 1000,
      focusState: "running",
      isPaused: false,
      accumulatedSeconds: 0,
    };
    const seconds = 2538; // 42:18

    it("Matrix 1: Name ON, Timer ON -> Build Movidict · 42:18", () => {
      const title = getTabTitle({
        session: activeSession,
        seconds,
        showSessionName: true,
        showSessionTimer: true,
      });
      expect(title).toBe("Build Movidict · 42:18");
    });

    it("Matrix 2: Name ON, Timer OFF -> Build Movidict", () => {
      const title = getTabTitle({
        session: activeSession,
        seconds,
        showSessionName: true,
        showSessionTimer: false,
      });
      expect(title).toBe("Build Movidict");
    });

    it("Matrix 3: Name OFF, Timer ON -> 42:18", () => {
      const title = getTabTitle({
        session: activeSession,
        seconds,
        showSessionName: false,
        showSessionTimer: true,
      });
      expect(title).toBe("42:18");
    });

    it("Matrix 4: Name OFF, Timer OFF -> Continuo", () => {
      const title = getTabTitle({
        session: activeSession,
        seconds,
        showSessionName: false,
        showSessionTimer: false,
      });
      expect(title).toBe("Continuo");
    });

    it("No active session -> Continuo", () => {
      expect(
        getTabTitle({
          session: null,
          seconds: 0,
          showSessionName: true,
          showSessionTimer: true,
        }),
      ).toBe("Continuo");

      expect(
        getTabTitle({
          session: { ...activeSession, focusState: "summary" },
          seconds: 120,
          showSessionName: true,
          showSessionTimer: true,
        }),
      ).toBe("Continuo");
    });
  });
});
