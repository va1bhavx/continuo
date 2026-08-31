import { AppStorage } from "./index";
import { ACHIEVEMENTS } from "../data/achievements";
import { triggerToast, playAchievementSound } from "../../utils/toast";

export async function checkAndUnlock(id: string) {
  try {
    const unlocked = await AppStorage.getUnlockedAchievements();
    if (unlocked.includes(id)) return;

    await AppStorage.unlockAchievement(id);
    const item = ACHIEVEMENTS.find(a => a.id === id);
    if (item) {
      // Play a short delay to avoid audio overlapping
      setTimeout(() => {
        playAchievementSound();
      }, 100);

      triggerToast({
        message: `Unlocked: ${item.title}`,
        type: "achievement",
        achievement: {
          title: item.title,
          description: item.description,
          icon: item.icon
        }
      });
    }
  } catch (e) {
    console.error("Failed to unlock achievement:", e);
  }
}

function getLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calculateStreak(history: any[]): number {
  const completed = history.filter(s => s.status === "completed");
  if (completed.length === 0) return 0;

  const dates = Array.from(new Set(
    completed.map(s => {
      const d = new Date(s.createdAt);
      return getLocalDateStr(d);
    })
  )).sort((a, b) => b.localeCompare(a)); // Descending order

  if (dates.length === 0) return 0;

  const todayStr = getLocalDateStr(new Date());
  const yesterdayStr = getLocalDateStr(new Date(Date.now() - 86400000));

  let streak = 0;
  let expectedDate = dates[0] === todayStr ? new Date() : (dates[0] === yesterdayStr ? new Date(Date.now() - 86400000) : null);

  if (!expectedDate) return 0;

  for (let i = 0; i < dates.length; i++) {
    const expectedStr = getLocalDateStr(expectedDate);
    if (dates[i] === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function checkFocusAchievements() {
  const history = await AppStorage.getHistory();
  const completed = history.filter(s => s.status === "completed");
  const totalCount = completed.length;

  // Session Milestones
  if (totalCount >= 1) await checkAndUnlock("first_timber");
  if (totalCount >= 5) await checkAndUnlock("timber_squad");
  if (totalCount >= 10) await checkAndUnlock("tenacious_ten");
  if (totalCount >= 25) await checkAndUnlock("silver_quarter");
  if (totalCount >= 50) await checkAndUnlock("half_centurion");
  if (totalCount >= 100) await checkAndUnlock("the_centurion");
  if (totalCount >= 250) await checkAndUnlock("industrial_age");
  if (totalCount >= 500) await checkAndUnlock("transcendent_flow");

  // Streak checks
  const streakObj = calculateFocusStreak(history);
  if (streakObj.count >= 2) await checkAndUnlock("spark");
  if (streakObj.count >= 3) await checkAndUnlock("habitual_spark");
  if (streakObj.count >= 7) await checkAndUnlock("volcano_streak");

  // Perfect score check: 5 consecutive completed focus sessions
  if (history.length >= 5) {
    const last5 = history.slice(0, 5);
    const allCompleted = last5.every(s => s.status === "completed");
    if (allCompleted) {
      await checkAndUnlock("perfect_score");
    }
  }

  // Duration checks & timing checks on the last session
  if (history.length > 0) {
    const last = history[0];
    const durationMins = Math.floor((last.endedAt - last.startedAt) / 60000);
    const durationSeconds = Math.floor((last.endedAt - last.startedAt) / 1000);

    if (last.status === "completed") {
      if (durationSeconds < 600) await checkAndUnlock("quick_spark");
      if (durationSeconds === 1500) await checkAndUnlock("classic_pomodoro");
      if (durationMins >= 45) await checkAndUnlock("orbiting");
      if (durationMins >= 60) await checkAndUnlock("flow_pioneer");
      if (durationMins >= 90) await checkAndUnlock("deep_space_navigator");
      if (durationMins >= 120) await checkAndUnlock("peak_flow");

      // Time of day checks
      const d = new Date(last.createdAt);
      const hours = d.getHours();

      if (hours < 6) await checkAndUnlock("early_bird");
      if (hours >= 22) await checkAndUnlock("night_owl");
      if (hours >= 0 && hours < 3) await checkAndUnlock("midnight_oil");
      if (hours >= 12 && hours < 14) await checkAndUnlock("midday_rush");

      if (last.title.length > 50) await checkAndUnlock("precision_intent");
    } else if (last.status === "stopped") {
      await checkAndUnlock("tactical_retreat");
    }
  }
}

export async function checkHistoryAchievements() {
  const history = await AppStorage.getHistory();
  const notes = history.filter(s => s.accomplishment && s.accomplishment.trim().length > 0);

  if (notes.length >= 1) await checkAndUnlock("scribe");
  if (notes.length >= 10) await checkAndUnlock("chronicle");
  if (notes.length >= 50) await checkAndUnlock("biographer");

  // Check if any stopped session has a note
  const stoppedWithNote = history.some(s => s.status === "stopped" && s.accomplishment && s.accomplishment.trim().length > 0);
  if (stoppedWithNote) {
    await checkAndUnlock("stoic_optimizer");
  }
}

export async function checkLinksAchievements() {
  const links = await AppStorage.getLinks();
  if (links.length >= 1) await checkAndUnlock("ignition_sequence");
  if (links.length >= 5) await checkAndUnlock("anchor_point");
  if (links.length >= 10) await checkAndUnlock("cockpit_commander");
}

export async function checkCustomizationAchievements() {
  const settings = await AppStorage.getSettings();
  const wallpaper = await AppStorage.getWallpaper();

  // Settings checks
  if (settings.clockShowSeconds === false) await checkAndUnlock("second_counter");
  if (settings.clock24Hour === true) await checkAndUnlock("military_time");
  if (settings.soundAlert === false) await checkAndUnlock("silent_focus");
  if (settings.tabTitleTimer === false) await checkAndUnlock("tab_watcher");

  // Wallpaper checks
  if (wallpaper === "none") {
    await checkAndUnlock("minimalist");
  } else if (wallpaper.startsWith("http://") || wallpaper.startsWith("https://") || wallpaper.startsWith("data:")) {
    await checkAndUnlock("aesthetic_architect");
  } else if (wallpaper.startsWith("/wall/") && wallpaper !== "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp") {
    await checkAndUnlock("interior_designer");
  }
}

export function calculateFocusStreak(history: any[]): { count: number; isActive: boolean } {
  // Filter sessions that are completed AND duration >= 3 minutes (180 seconds)
  const validSessions = history.filter(s => {
    if (s.status !== "completed") return false;
    const durationSec = Math.floor((s.endedAt - s.startedAt) / 1000);
    return durationSec >= 180;
  });

  if (validSessions.length === 0) {
    return { count: 0, isActive: false };
  }

  // Get unique YYYY-MM-DD dates, sorted in descending order
  const dates = Array.from(new Set(
    validSessions.map(s => {
      const d = new Date(s.createdAt);
      return getLocalDateStr(d);
    })
  )).sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) {
    return { count: 0, isActive: false };
  }

  const todayStr = getLocalDateStr(new Date());
  const yesterdayStr = getLocalDateStr(new Date(Date.now() - 86400000));

  const hasSessionToday = dates[0] === todayStr;
  const hasSessionYesterday = dates[0] === yesterdayStr;
  const isActive = hasSessionToday || hasSessionYesterday;

  if (!isActive) {
    return { count: 0, isActive: false };
  }

  let count = 0;
  const expectedDate = hasSessionToday ? new Date() : new Date(Date.now() - 86400000);

  for (let i = 0; i < dates.length; i++) {
    const expectedStr = getLocalDateStr(expectedDate);
    if (dates[i] === expectedStr) {
      count++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { count, isActive };
}
