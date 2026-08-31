import { AppStorage } from "./index";
import { ACHIEVEMENTS } from "../data/achievements";
import { triggerToast, playAchievementSound } from "../../utils/toast";

export async function checkAndUnlock(id: string, silent = false) {
  try {
    const unlocked = await AppStorage.getUnlockedAchievements();
    if (unlocked.includes(id)) return;

    await AppStorage.unlockAchievement(id);
    if (silent) return;

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

export async function checkFocusAchievements(silent = false) {
  const history = await AppStorage.getHistory();
  const completed = history.filter(s => s.status === "completed");
  const totalCount = completed.length;

  // Session Milestones
  if (totalCount >= 1) await checkAndUnlock("first_timber", silent);
  if (totalCount >= 5) await checkAndUnlock("timber_squad", silent);
  if (totalCount >= 10) await checkAndUnlock("tenacious_ten", silent);
  if (totalCount >= 25) await checkAndUnlock("silver_quarter", silent);
  if (totalCount >= 50) await checkAndUnlock("half_centurion", silent);
  if (totalCount >= 100) await checkAndUnlock("the_centurion", silent);
  if (totalCount >= 250) await checkAndUnlock("industrial_age", silent);
  if (totalCount >= 500) await checkAndUnlock("transcendent_flow", silent);

  // Streak checks
  const streakObj = calculateFocusStreak(history);
  if (streakObj.count >= 2) await checkAndUnlock("spark", silent);
  if (streakObj.count >= 3) await checkAndUnlock("habitual_spark", silent);
  if (streakObj.count >= 7) await checkAndUnlock("volcano_streak", silent);

  // Perfect score check: 5 consecutive completed focus sessions
  if (history.length >= 5) {
    const last5 = history.slice(0, 5);
    const allCompleted = last5.every(s => s.status === "completed");
    if (allCompleted) {
      await checkAndUnlock("perfect_score", silent);
    }
  }

  // Duration checks & timing checks on the last session
  if (history.length > 0) {
    const last = history[0];
    const durationMins = Math.floor((last.endedAt - last.startedAt) / 60000);
    const durationSeconds = Math.floor((last.endedAt - last.startedAt) / 1000);

    if (last.status === "completed") {
      if (durationSeconds < 600) await checkAndUnlock("quick_spark", silent);
      if (durationSeconds === 1500) await checkAndUnlock("classic_pomodoro", silent);
      if (durationMins >= 45) await checkAndUnlock("orbiting", silent);
      if (durationMins >= 60) await checkAndUnlock("flow_pioneer", silent);
      if (durationMins >= 90) await checkAndUnlock("deep_space_navigator", silent);
      if (durationMins >= 120) await checkAndUnlock("peak_flow", silent);

      // Time of day checks
      const d = new Date(last.createdAt);
      const hours = d.getHours();

      if (hours < 6) await checkAndUnlock("early_bird", silent);
      if (hours >= 22) await checkAndUnlock("night_owl", silent);
      if (hours >= 0 && hours < 3) await checkAndUnlock("midnight_oil", silent);
      if (hours >= 12 && hours < 14) await checkAndUnlock("midday_rush", silent);

      if (last.title.length > 50) await checkAndUnlock("precision_intent", silent);
    } else if (last.status === "stopped") {
      await checkAndUnlock("tactical_retreat", silent);
    }
  }
}

export async function checkHistoryAchievements(silent = false) {
  const history = await AppStorage.getHistory();
  let totalNotesCount = 0;
  let hasStoppedWithNote = false;

  history.forEach(s => {
    let hasNote = false;
    if (s.accomplishment && s.accomplishment.trim().length > 0) {
      // Split by newline to avoid double-counting if we joined them, or count unique.
      // Wait! Since in updateSessionAccomplishment we did:
      // s.accomplishment = newAccomplishments.join("\n")
      // If we count s.accomplishment, it has multiple lines. We can just count the elements in accomplishments array if present,
      // and fall back to counting lines or 1 if only legacy s.accomplishment is present!
      // This is extremely smart!
      if (s.accomplishments && s.accomplishments.length > 0) {
        totalNotesCount += s.accomplishments.filter(n => n.trim().length > 0).length;
        hasNote = true;
      } else {
        totalNotesCount++;
        hasNote = true;
      }
    }
    if (s.status === "stopped" && hasNote) {
      hasStoppedWithNote = true;
    }
  });

  if (totalNotesCount >= 1) await checkAndUnlock("scribe", silent);
  if (totalNotesCount >= 10) await checkAndUnlock("chronicle", silent);
  if (totalNotesCount >= 50) await checkAndUnlock("biographer", silent);

  if (hasStoppedWithNote) {
    await checkAndUnlock("stoic_optimizer", silent);
  }
}

export async function checkLinksAchievements(silent = false) {
  const links = await AppStorage.getLinks();
  if (links.length >= 1) await checkAndUnlock("ignition_sequence", silent);
  if (links.length >= 5) await checkAndUnlock("anchor_point", silent);
  if (links.length >= 10) await checkAndUnlock("cockpit_commander", silent);
}

export async function checkCustomizationAchievements(silent = false) {
  const settings = await AppStorage.getSettings();
  const wallpaper = await AppStorage.getWallpaper();

  // Settings checks
  if (settings.clockShowSeconds === false) await checkAndUnlock("second_counter", silent);
  if (settings.clock24Hour === true) await checkAndUnlock("military_time", silent);
  if (settings.soundAlert === false) await checkAndUnlock("silent_focus", silent);
  if (settings.tabTitleTimer === false) await checkAndUnlock("tab_watcher", silent);

  // Wallpaper checks
  if (wallpaper === "none") {
    await checkAndUnlock("minimalist", silent);
  } else if (wallpaper.startsWith("http://") || wallpaper.startsWith("https://") || wallpaper.startsWith("data:")) {
    await checkAndUnlock("aesthetic_architect", silent);
  } else if (wallpaper.startsWith("/wall/") && wallpaper !== "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp") {
    await checkAndUnlock("interior_designer", silent);
  }
}

export async function syncAllAchievements(silent = true) {
  try {
    await checkFocusAchievements(silent);
    await checkHistoryAchievements(silent);
    await checkLinksAchievements(silent);
    await checkCustomizationAchievements(silent);
  } catch (e) {
    console.error("Failed to silently sync achievements:", e);
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
