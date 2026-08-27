// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { AppStorage } from "./index";

describe("AppStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return default settings when empty", async () => {
    const settings = await AppStorage.getSettings();
    expect(settings).toEqual({
      clockShowSeconds: true,
      clock24Hour: false,
      tabTitleTimer: true,
      soundAlert: true,
    });
  });

  it("should save and retrieve custom settings", async () => {
    await AppStorage.saveSettings({
      clockShowSeconds: false,
      clock24Hour: true,
      tabTitleTimer: false,
      soundAlert: false,
    });

    const settings = await AppStorage.getSettings();
    expect(settings).toEqual({
      clockShowSeconds: false,
      clock24Hour: true,
      tabTitleTimer: false,
      soundAlert: false,
    });
  });

  it("should return empty quick links when empty", async () => {
    const links = await AppStorage.getLinks();
    expect(links).toHaveLength(0);
  });

  it("should save and retrieve custom quick links", async () => {
    const customLinks = [
      { id: "test-1", label: "Tailwind CSS", url: "https://tailwindcss.com" }
    ];
    await AppStorage.saveLinks(customLinks);

    const links = await AppStorage.getLinks();
    expect(links).toEqual(customLinks);
  });

  it("should save sessions to history and retrieve them", async () => {
    const session = {
      id: "session_test",
      title: "Write Vitest suite",
      startedAt: Date.now() - 30 * 60 * 1000,
      endedAt: Date.now(),
      status: "completed" as const,
      createdAt: Date.now(),
    };

    let history = await AppStorage.getHistory();
    expect(history).toHaveLength(0);

    await AppStorage.saveSession(session);
    history = await AppStorage.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(session);

    await AppStorage.clearHistory();
    history = await AppStorage.getHistory();
    expect(history).toHaveLength(0);
  });
});
