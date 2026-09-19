// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { AppStorage } from "./index";

describe("AppStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return default settings when empty with tab title settings enabled", async () => {
    const settings = await AppStorage.getSettings();
    expect(settings).toEqual({
      clockShowSeconds: true,
      clock24Hour: false,
      tabTitleTimer: true,
      showSessionTimerInTitle: true,
      showSessionNameInTitle: true,
      soundAlert: true,
    });
  });

  it("should save and retrieve custom settings", async () => {
    await AppStorage.saveSettings({
      clockShowSeconds: false,
      clock24Hour: true,
      tabTitleTimer: false,
      showSessionTimerInTitle: false,
      showSessionNameInTitle: false,
      soundAlert: false,
    });

    const settings = await AppStorage.getSettings();
    expect(settings).toEqual({
      clockShowSeconds: false,
      clock24Hour: true,
      tabTitleTimer: false,
      showSessionTimerInTitle: false,
      showSessionNameInTitle: false,
      soundAlert: false,
    });
  });

  it("should normalize legacy settings missing new tab title properties", async () => {
    // Simulate legacy storage without showSessionNameInTitle / showSessionTimerInTitle
    localStorage.setItem(
      "app_settings",
      JSON.stringify({
        clockShowSeconds: false,
        clock24Hour: true,
        tabTitleTimer: false,
        soundAlert: true,
      }),
    );

    const settings = await AppStorage.getSettings();
    expect(settings.showSessionTimerInTitle).toBe(false); // inherits from legacy tabTitleTimer
    expect(settings.showSessionNameInTitle).toBe(true); // default true for existing users
  });

  it("should return empty quick links when empty", async () => {
    const links = await AppStorage.getLinks();
    expect(links).toHaveLength(0);
  });

  it("should save and retrieve custom quick links", async () => {
    const customLinks = [
      { id: "test-1", label: "Tailwind CSS", url: "https://tailwindcss.com" },
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

  it("should normalize legacy todos with active/completed/deleted status", async () => {
    localStorage.setItem(
      "todo_list_items",
      JSON.stringify([
        { id: "t1", title: "Legacy active", description: "", completed: false },
        { id: "t2", title: "Legacy completed", description: "", completed: true },
      ]),
    );

    const todos = await AppStorage.getTodos();
    expect(todos).toHaveLength(2);
    expect(todos[0].status).toBe("active");
    expect(todos[0].completed).toBe(false);
    expect(todos[1].status).toBe("completed");
    expect(todos[1].completed).toBe(true);
  });

  it("should normalize schedule slots with scheduled/completed status", async () => {
    localStorage.setItem(
      "schedule_slots",
      JSON.stringify([
        { id: "s1", time: "10:00", title: "Legacy slot", description: "" },
        { id: "s2", time: "12:00", title: "Notified once slot", description: "", type: "once", notified: true },
      ]),
    );

    const slots = await AppStorage.getSchedule();
    expect(slots).toHaveLength(2);
    expect(slots[0].status).toBe("scheduled");
    expect(slots[1].status).toBe("completed");
  });
});
