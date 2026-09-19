// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { AppStorage } from "../lib/storage";
import type { ScheduleSlot } from "../lib/storage";

describe("Schedule storage and status lifecycle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds an upcoming schedule slot and persists", async () => {
    const slot: ScheduleSlot = {
      id: "slot_1",
      time: "10:00",
      title: "Build Movidict",
      description: "Frontend layout",
      status: "scheduled",
      type: "daily",
      createdAt: Date.now(),
    };

    await AppStorage.saveSchedule([slot]);

    const loaded = await AppStorage.getSchedule();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("slot_1");
    expect(loaded[0].status).toBe("scheduled");
  });

  it("moves completed slots to history without deleting them", async () => {
    const slot: ScheduleSlot = {
      id: "slot_1",
      time: "10:00",
      title: "Build Movidict",
      description: "",
      status: "scheduled",
      type: "daily",
      createdAt: Date.now(),
    };
    await AppStorage.saveSchedule([slot]);

    const completedSlot: ScheduleSlot = {
      ...slot,
      status: "completed",
      completedAt: Date.now(),
    };
    await AppStorage.saveSchedule([completedSlot]);

    const loaded = await AppStorage.getSchedule();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].status).toBe("completed");

    const upcoming = loaded.filter((s) => s.status === "scheduled");
    const history = loaded.filter(
      (s) => s.status === "completed" || s.status === "cancelled" || s.status === "missed",
    );

    expect(upcoming).toHaveLength(0);
    expect(history).toHaveLength(1);
    expect(history[0].title).toBe("Build Movidict");
  });

  it("handles missed and cancelled schedule statuses in history", async () => {
    const slots: ScheduleSlot[] = [
      {
        id: "slot_cancelled",
        time: "14:00",
        title: "Cancelled testing session",
        description: "",
        status: "cancelled",
        createdAt: Date.now(),
      },
      {
        id: "slot_missed",
        time: "16:00",
        title: "Missed backend session",
        description: "",
        status: "missed",
        createdAt: Date.now(),
      },
    ];

    await AppStorage.saveSchedule(slots);

    const loaded = await AppStorage.getSchedule();
    expect(loaded).toHaveLength(2);

    const history = loaded.filter(
      (s) => s.status === "completed" || s.status === "cancelled" || s.status === "missed",
    );
    expect(history).toHaveLength(2);
  });
});
