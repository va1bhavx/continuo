import { useEffect, useState } from "react";
import { Link, RotateCcwClock, SlidersHorizontal, BarChart3, Flame, FlameKindling } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import { calculateFocusStreak } from "../../lib/storage/achievements-helper";

export default function RightHeader() {
  const navigation = useNavigation();
  const [streak, setStreak] = useState<{ count: number; isActive: boolean }>({ count: 0, isActive: false });

  const loadStreak = async () => {
    try {
      const history = await AppStorage.getHistory();
      const s = calculateFocusStreak(history);
      setStreak(s);
    } catch (e) {
      console.error("Failed to load streak:", e);
    }
  };

  useEffect(() => {
    loadStreak();
  }, []);

  // Sync streak changes in real-time when focus sessions are added/cleared
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && (changes.focus_history || changes.active_session)) {
        loadStreak();
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && (customEvent.detail.key === "focus_history" || customEvent.detail.key === "active_session")) {
        loadStreak();
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

  const iconClass = `
    text-text-primary
    transition-colors
    duration-200
    cursor-pointer
    hover:text-accent
    hover:bg-surface-hover
    rounded-md
    px-2 py-2
    group
  `;

  return (
    <div className="flex items-center gap-3">
      {/* Streak Badge */}
      <div className="relative group/streak">
        <div
          className={`
            flex items-center gap-1.5
            px-3 py-1.5
            rounded-full
            text-xs font-semibold
            transition-all duration-300
            cursor-default select-none
            ${
              streak.isActive
                ? "bg-accent/10 border border-accent/30 text-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.15)] animate-pulse hover:animate-none"
                : "bg-surface/40 border border-border/40 text-text-secondary"
            }
          `}
        >
          {streak.isActive ? (
            <Flame size={15} className="fill-accent stroke-accent" />
          ) : (
            <FlameKindling size={15} className="text-text-secondary" />
          )}
          <span>{streak.count}</span>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute top-full right-0 mt-2.5 w-48 bg-surface-hover/95 backdrop-blur-md border border-border rounded-lg shadow-xl p-2.5 text-left opacity-0 pointer-events-none group-hover/streak:opacity-100 transition-opacity duration-200 z-50 text-shadow-none text-xs">
          {streak.isActive ? (
            <>
              <p className="font-bold text-accent mb-0.5 flex items-center gap-1">
                🔥 Active Streak: {streak.count} {streak.count === 1 ? 'Day' : 'Days'}
              </p>
              <p className="text-text-secondary leading-normal text-[10px]">
                You're on fire! Keep focusing daily (3+ mins) to keep the streak burning.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-text-secondary mb-0.5 flex items-center gap-1">
                🪵 Streak Broken
              </p>
              <p className="text-text-tertiary leading-normal text-[10px]">
                No session of 3+ mins logged today or yesterday. Complete a 3+ minute session to rekindle the fire!
              </p>
            </>
          )}
        </div>
      </div>

      <button
        className={iconClass}
        aria-label="Statistics"
        title="Statistics"
        onClick={() => navigation.setView("stats")}
      >
        <BarChart3 size={18} className="group-hover:text-text-primary" />
      </button>
      <button
        className={iconClass}
        aria-label="History"
        title="History"
        onClick={() => navigation.setView("history")}
      >
        <RotateCcwClock size={18} className="group-hover:text-text-primary" />
      </button>
      <button
        className={iconClass}
        aria-label="Link"
        title="Manage Links"
        onClick={() => navigation.setView("links")}
      >
        <Link size={18} className="group-hover:text-text-primary" />
      </button>
      <button
        className={iconClass}
        aria-label="Settings"
        title="Settings"
        onClick={() => navigation.setView("settings")}
      >
        <SlidersHorizontal
          size={18}
          className="group-hover:text-text-primary"
        />
      </button>
    </div>
  );
}
