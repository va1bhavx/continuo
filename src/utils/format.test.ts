import { describe, it, expect } from "vitest";
import { getInitials } from "../components/web/manage-links";
import { formatTime, formatDurationFriendly } from "../components/web/add-task";
import { 
  formatStartTime, 
  formatDuration, 
  formatTotalDuration, 
  getLocalDateString, 
  getDayLabel 
} from "../components/web/history";

describe("manage-links utils", () => {
  it("getInitials should return upper-cased initials", () => {
    expect(getInitials("GitHub")).toBe("GI");
    expect(getInitials("Google Search")).toBe("GS");
    expect(getInitials("   ")).toBe("?");
    expect(getInitials("SingleWord")).toBe("SI");
    expect(getInitials("Three Word Label")).toBe("TW");
  });
});

describe("add-task formatters", () => {
  it("formatTime should format seconds to HH:MM:SS", () => {
    expect(formatTime(0)).toBe("00:00:00");
    expect(formatTime(59)).toBe("00:00:59");
    expect(formatTime(60)).toBe("00:01:00");
    expect(formatTime(3599)).toBe("00:59:59");
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(86399)).toBe("23:59:59");
  });

  it("formatDurationFriendly should return clean human-readable times", () => {
    expect(formatDurationFriendly(0)).toBe("0s");
    expect(formatDurationFriendly(45)).toBe("45s");
    expect(formatDurationFriendly(60)).toBe("1m");
    expect(formatDurationFriendly(90)).toBe("1m 30s");
    expect(formatDurationFriendly(3600)).toBe("1h");
    expect(formatDurationFriendly(3665)).toBe("1h 1m 5s");
  });
});

describe("history formatters", () => {
  it("formatStartTime should format timestamp to AM/PM string", () => {
    const timestamp = new Date("2026-08-26T14:35:00").getTime();
    expect(formatStartTime(timestamp)).toMatch(/2:35\s*(PM|pm)/);
  });

  it("formatDuration should calculate minutes, hours, and label them", () => {
    const start = Date.now();
    // 5 minutes duration
    expect(formatDuration(start, start + 5 * 60 * 1000)).toBe("5min");
    // 1 hour and 15 minutes duration
    expect(formatDuration(start, start + 75 * 60 * 1000)).toBe("1h 15min");
    // 2 hours duration
    expect(formatDuration(start, start + 120 * 60 * 1000)).toBe("2h");
  });

  it("formatTotalDuration should sum duration to human-readable format", () => {
    // 90 minutes total
    expect(formatTotalDuration(90 * 60 * 1000)).toBe("1h 30min");
    // 4 hours total
    expect(formatTotalDuration(240 * 60 * 1000)).toBe("4h");
    // 15 minutes total
    expect(formatTotalDuration(15 * 60 * 1000)).toBe("15min");
  });

  it("getLocalDateString should yield standard YYYY-MM-DD", () => {
    const d = new Date("2026-08-26T12:00:00");
    expect(getLocalDateString(d.getTime())).toBe("2026-08-26");
  });

  it("getDayLabel should correctly return Today, Yesterday, or formatted date", () => {
    const now = Date.now();
    expect(getDayLabel(now)).toBe("Today");

    const yesterday = now - 24 * 60 * 60 * 1000;
    expect(getDayLabel(yesterday)).toBe("Yesterday");

    const longerAgo = new Date("2025-12-25T12:00:00").getTime();
    expect(getDayLabel(longerAgo)).toBe("December 25, 2025");
  });
});
