import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { AppSettings } from "../../lib/storage";
import { checkFocusAchievements, checkHistoryAchievements } from "../../lib/storage/achievements-helper";

declare const chrome: any;

type FocusState = "idle" | "running" | "summary";

export const formatTime = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const formatDurationFriendly = (totalSeconds: number) => {
  if (totalSeconds === 0) return "0s";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(" ");
};

export default function AddTask() {
  const navigation = useNavigation();

  const [focusState, setFocusState] = useState<FocusState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [task, setTask] = useState<string>("");
  const [accomplishment, setAccomplishment] = useState<string>("");
  const [sessionAccomplishments, setSessionAccomplishments] = useState<string[]>([]);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<"completed" | "stopped">("completed");
  const [settings, setSettings] = useState<AppSettings>({
    clockShowSeconds: true,
    clock24Hour: false,
    tabTitleTimer: true,
    soundAlert: true,
  });

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (focusState === "running" && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusState, isPaused]);

  // Check storage for active running session on mount
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const active = await AppStorage.getActiveSession();
        if (active) {
          setTask(active.task);
          setFocusState(active.focusState);
          setStartedAt(active.startedAt);
          const activeIsPaused = !!active.isPaused;
          const activeAccumulated = active.accumulatedSeconds || 0;
          setIsPaused(activeIsPaused);

          if (active.focusState === "running") {
            if (activeIsPaused) {
              setSeconds(activeAccumulated);
            } else {
              const elapsed = activeAccumulated + Math.floor((Date.now() - active.startedAt) / 1000);
              setSeconds(elapsed);
            }
          } else if (active.focusState === "summary") {
            const elapsed = activeAccumulated + Math.floor((Date.now() - active.startedAt) / 1000);
            setSeconds(elapsed);
            if (active.sessionStatus) setSessionStatus(active.sessionStatus);
            if (active.currentSessionId) {
              setCurrentSessionId(active.currentSessionId);
              // Retrieve accomplishments from history
              try {
                const history = await AppStorage.getHistory();
                const currentSession = history.find(s => s.id === active.currentSessionId);
                if (currentSession) {
                  const list = currentSession.accomplishments || (currentSession.accomplishment ? [currentSession.accomplishment] : []);
                  setSessionAccomplishments(list);
                }
              } catch (err) {
                console.error("Failed to load accomplishments from history on mount:", err);
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to load active session:", e);
      }
    };
    checkActiveSession();
  }, []);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AppStorage.getSettings();
        setSettings(saved);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, []);

  // Listen to state changes & settings changes from other open tabs
  useEffect(() => {
    const handleActiveSessionUpdate = (active: any) => {
      if (!active) {
        setSeconds(0);
        setTask("");
        setAccomplishment("");
        setIsNoteSaved(false);
        setCurrentSessionId(null);
        setFocusState("idle");
        setIsPaused(false);
        setStartedAt(0);
      } else if (active.focusState === "running") {
        setTask(active.task);
        setFocusState("running");
        setStartedAt(active.startedAt);
        const activeIsPaused = !!active.isPaused;
        const activeAccumulated = active.accumulatedSeconds || 0;
        setIsPaused(activeIsPaused);

        if (activeIsPaused) {
          setSeconds(activeAccumulated);
        } else {
          const elapsed = activeAccumulated + Math.floor((Date.now() - active.startedAt) / 1000);
          setSeconds(elapsed);
        }
      } else if (active.focusState === "summary") {
        setTask(active.task);
        setFocusState("summary");
        const activeAccumulated = active.accumulatedSeconds || 0;
        const elapsed = activeAccumulated + Math.floor((Date.now() - active.startedAt) / 1000);
        setSeconds(elapsed);
        if (active.sessionStatus) setSessionStatus(active.sessionStatus);
        if (active.currentSessionId) setCurrentSessionId(active.currentSessionId);
      }
    };

    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local") {
        if (changes.active_session) {
          handleActiveSessionUpdate(changes.active_session.newValue);
        }
        if (changes.app_settings) {
          setSettings(changes.app_settings.newValue);
        }
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.key === "active_session") {
          handleActiveSessionUpdate(customEvent.detail.newValue);
        }
        if (customEvent.detail.key === "app_settings") {
          setSettings(customEvent.detail.newValue);
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

  // Sync tab title with active running timer
  useEffect(() => {
    if (settings.tabTitleTimer && focusState === "running") {
      document.title = `(${formatTime(seconds)}) continuo`;
    } else {
      document.title = "continuo";
    }

    return () => {
      document.title = "continuo";
    };
  }, [seconds, focusState, settings.tabTitleTimer]);



  const handleStartFocus = async () => {
    const started = Date.now();
    setFocusState("running");
    setSeconds(0);
    setIsPaused(false);
    setStartedAt(started);

    await AppStorage.setActiveSession({
      task: task,
      startedAt: started,
      focusState: "running",
      isPaused: false,
      accumulatedSeconds: 0,
    });
  };

  const handlePauseFocus = async () => {
    if (focusState !== "running" || isPaused) return;

    const currentTotal = seconds;

    setIsPaused(true);

    await AppStorage.setActiveSession({
      task: task,
      startedAt: startedAt,
      focusState: "running",
      isPaused: true,
      accumulatedSeconds: currentTotal,
    });
  };

  const handleResumeFocus = async () => {
    if (focusState !== "running" || !isPaused) return;

    const newStartedAt = Date.now();
    setIsPaused(false);
    setStartedAt(newStartedAt);

    await AppStorage.setActiveSession({
      task: task,
      startedAt: newStartedAt,
      focusState: "running",
      isPaused: false,
      accumulatedSeconds: seconds,
    });
  };

  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn("Failed to play audio alert chime:", e);
    }
  };

  const handleEndSession = async (status: "completed" | "stopped") => {
    setFocusState("summary");
    setSessionStatus(status);

    const sessionId = `session_${Date.now()}`;
    setCurrentSessionId(sessionId);

    const sessionData = {
      id: sessionId,
      title: task,
      startedAt: Date.now() - seconds * 1000,
      endedAt: Date.now(),
      status: status,
      createdAt: Date.now(),
    };

    await AppStorage.saveSession(sessionData);

    await AppStorage.setActiveSession({
      task: task,
      startedAt: Date.now() - seconds * 1000,
      focusState: "summary",
      sessionStatus: status,
      currentSessionId: sessionId,
      accumulatedSeconds: seconds,
    });

    if (settings.soundAlert) {
      playAlertSound();
    }

    await checkFocusAchievements();
  };

  const handleSaveNote = async () => {
    const cleanNote = accomplishment.trim();
    if (!cleanNote || !currentSessionId) return;

    await AppStorage.updateSessionAccomplishment(currentSessionId, cleanNote);
    
    // Add to the local display list
    setSessionAccomplishments(prev => [...prev, cleanNote]);
    setAccomplishment("");
    setIsNoteSaved(true);
    
    // Reset saved status after a brief delay so the user can type and save more notes
    setTimeout(() => {
      setIsNoteSaved(false);
    }, 1500);

    await checkHistoryAchievements();
  };

  const handleStartAnother = async () => {
    setSeconds(0);
    setTask("");
    setAccomplishment("");
    setSessionAccomplishments([]);
    setIsNoteSaved(false);
    setCurrentSessionId(null);
    setFocusState("idle");
    setIsPaused(false);
    setStartedAt(0);

    await AppStorage.clearActiveSession();
  };

  return (
    <section className="max-w-lg mx-auto w-full flex flex-col items-center gap-5 text-center text-shadow-legible">
      {/* Intention state header */}
      {focusState === "running" && (
        <div className="flex flex-col items-center gap-3 animate-scale-in">
          <div className="flex items-center gap-2">
            <p className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <p className="text-xs text-text-secondary">Current Focus</p>
          </div>

          <h2 className="text-4xl font-medium tracking-[-0.02em] text-text-primary break-words max-w-lg">
            {task}
          </h2>
        </div>
      )}

      {/* Timer / Question Area */}
      <div className="space-y-1.5 mb-2 animate-scale-in">
        {focusState === "idle" && (
          <>
            <h2 className="text-4xl font-medium tracking-[-0.02em] text-text-primary">
              What are you working on?
            </h2>

            <p className="text-md text-text-secondary">
              Set an intention and get back to work.
            </p>
          </>
        )}

        {focusState === "running" && (
          <h2 className="text-7xl font-medium tracking-[-0.02em] text-text-primary">
            {formatTime(seconds)}
          </h2>
        )}
      </div>

      {/* Input or Summary view */}
      {focusState === "idle" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (task.trim()) {
              handleStartFocus();
            }
          }}
          className="w-full animate-slide-up-subtle"
        >
          <Input
            type="text"
            placeholder="Build something great"
            autoFocus
            onChange={handleTaskChange}
            value={task}
          />
        </form>
      )}

      {focusState === "summary" && (
        <div className="flex flex-col items-center gap-6 w-full animate-scale-in">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {sessionStatus === "completed"
                ? "Focus Completed"
                : "Focus Stopped"}
            </p>
            <h2 className="text-4xl font-medium tracking-[-0.02em] text-text-primary break-words max-w-lg">
              {task}
            </h2>
            <p className="text-text-secondary text-sm font-medium">
              Took {formatDurationFriendly(seconds)}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-text-secondary text-xs bg-surface-2/60 border border-border px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-check" />
              <span>Session ended & saved to history</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full max-w-md text-left mt-2 animate-fade-in">
            <label className="text-[13px] font-medium tracking-[-0.01em] text-text-secondary">
              What you accomplished (optional)
            </label>

            {/* Display list of accomplishments saved so far */}
            {sessionAccomplishments.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2.5 p-3 rounded-lg bg-surface/50 border border-border/40 max-h-[160px] overflow-y-auto">
                <p className="text-[9px] uppercase font-bold tracking-wider text-text-tertiary">Logged Accomplishments:</p>
                <div className="flex flex-col gap-1">
                  {sessionAccomplishments.map((note, idx) => (
                    <div key={idx} className="text-xs text-text-primary leading-relaxed flex items-start gap-1.5">
                      <span className="text-accent mt-1 shrink-0 select-none">•</span>
                      <span className="italic">“{note}”</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative flex flex-col items-end w-full gap-2">
              <textarea
                placeholder="Briefly describe what you got done..."
                className="
                  w-full
                  min-h-[100px]
                  rounded-md
                  border
                  bg-text-primary
                  px-3.5
                  py-3
                  text-[14px]
                  font-medium
                  tracking-[-0.01em]
                  text-surface!
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                  outline-none
                  resize-none

                  border-border
                  placeholder:text-text-tertiary!
                  placeholder:font-normal

                  transition-[border-color,background-color,box-shadow]
                  duration-150
                  ease-out

                  hover:border-border-strong

                  focus:border-accent-soft-border
                  focus:shadow-[0_0_0_3px_var(--accent-soft)]
                "
                value={accomplishment}
                onChange={(e) => {
                  setAccomplishment(e.target.value);
                  setIsNoteSaved(false);
                }}
              />
              <button
                type="button"
                className={`
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  rounded-md
                  transition-all
                  duration-150
                  cursor-pointer
                  border-0
                  ${
                    isNoteSaved
                      ? "bg-accent/20 text-accent! cursor-default pointer-events-none"
                      : "bg-accent text-accent-text! hover:bg-accent-hover active:scale-[0.97]"
                  }
                `}
                onClick={handleSaveNote}
                disabled={isNoteSaved || !accomplishment.trim()}
              >
                {isNoteSaved ? "Saved ✓" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4">
        {focusState === "idle" && (
          <div className="animate-slide-up-subtle">
            <button
              type="button"
              className="
                h-11
                rounded-md
                bg-accent
                px-5
                text-sm
                font-medium
                text-accent-text!
                shadow-[0_1px_2px_rgba(0,0,0,0.2)]
                transition-all
                duration-150

                hover:bg-accent-hover
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                cursor-pointer

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-accent-soft-border
                focus-visible:ring-offset-2
                focus-visible:ring-offset-bg
              "
              onClick={handleStartFocus}
              disabled={!task.trim()}
            >
              Start Focus
            </button>
          </div>
        )}

        {focusState === "running" && (
          <div className="flex items-center gap-3 animate-slide-up-subtle">
            {isPaused ? (
              <button
                type="button"
                className="
                  h-11
                  rounded-md
                  bg-accent
                  px-5
                  text-sm
                  font-medium
                  text-accent-text!
                  shadow-[0_1px_2px_rgba(0,0,0,0.2)]
                  transition-all
                  duration-150

                  hover:bg-accent-hover
                  active:scale-[0.98]
                  cursor-pointer
                "
                onClick={handleResumeFocus}
              >
                Resume
              </button>
            ) : (
              <button
                type="button"
                className="
                  h-11
                  rounded-md
                  border
                  border-border
                  bg-transparent
                  px-5
                  text-sm
                  font-medium
                  text-text-primary
                  transition-all
                  duration-150

                  hover:bg-surface-hover
                  active:scale-[0.98]
                  cursor-pointer
                "
                onClick={handlePauseFocus}
              >
                Pause
              </button>
            )}

            <button
              type="button"
              className={
                isPaused
                  ? `
                    h-11
                    rounded-md
                    border
                    border-border
                    bg-transparent
                    px-5
                    text-sm
                    font-medium
                    text-text-primary
                    transition-all
                    duration-150

                    hover:bg-surface-hover
                    active:scale-[0.98]
                    cursor-pointer
                  `
                  : `
                    h-11
                    rounded-md
                    bg-accent
                    px-5
                    text-sm
                    font-medium
                    text-accent-text!
                    shadow-[0_1px_2px_rgba(0,0,0,0.2)]
                    transition-all
                    duration-150

                    hover:bg-accent-hover
                    active:scale-[0.98]
                    cursor-pointer
                  `
              }
              onClick={() => handleEndSession("completed")}
            >
              Complete
            </button>

            <button
              type="button"
              className="
                h-11
                rounded-md
                border
                border-border
                bg-transparent
                px-5
                text-sm
                font-medium
                text-text-primary
                transition-all
                duration-150

                hover:bg-surface-hover
                active:scale-[0.98]
                cursor-pointer
              "
              onClick={() => handleEndSession("stopped")}
            >
              Stop
            </button>
          </div>
        )}

        {focusState === "summary" && (
          <div className="flex items-center gap-3 animate-slide-up-subtle">
            <button
              type="button"
              className="
                h-11
                rounded-md
                bg-accent
                px-5
                text-sm
                font-medium
                text-accent-text!
                shadow-[0_1px_2px_rgba(0,0,0,0.2)]
                transition-all
                duration-150

                hover:bg-accent-hover
                active:scale-[0.98]
                cursor-pointer
              "
              onClick={handleStartAnother}
            >
              Start another focus
            </button>

            <button
              type="button"
              className="
                h-11
                rounded-md
                border
                border-border
                bg-transparent
                px-5
                text-sm
                font-medium
                text-text-primary
                transition-all
                duration-150

                hover:bg-surface-hover
                active:scale-[0.98]
                cursor-pointer
              "
              onClick={() => navigation.setView("history")}
            >
              View History
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
