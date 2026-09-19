import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useNavigation } from "../../context/navigation-context";
import { useCurrentSession } from "../../hooks/useCurrentSession";
import { useSettings } from "../../hooks/useSettings";
import { formatTime, formatDurationFriendly } from "../../utils/session-timing";

export { formatTime, formatDurationFriendly };

export default function AddTask() {
  const navigation = useNavigation();
  const { settings } = useSettings();
  const {
    focusState,
    task,
    isPaused,
    seconds,
    sessionStatus,
    sessionAccomplishments,
    isNoteSaved,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    saveAccomplishment,
    startAnother,
  } = useCurrentSession();

  const [inputTask, setInputTask] = useState("");
  const [accomplishment, setAccomplishment] = useState("");

  // Sync input task when task changes externally or session clears
  useEffect(() => {
    if (focusState === "idle") {
      setInputTask("");
    }
  }, [focusState]);

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTask(e.target.value);
  };

  const playAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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

  const handleStartFocus = async () => {
    const clean = inputTask.trim();
    if (!clean) return;
    await startSession(clean);
  };

  const handleEndSessionClick = async (status: "completed" | "stopped") => {
    await endSession(status);
    if (settings.soundAlert) {
      playAlertSound();
    }
  };

  const handleSaveNoteClick = async () => {
    const cleanNote = accomplishment.trim();
    if (!cleanNote) return;
    await saveAccomplishment(cleanNote);
    setAccomplishment("");
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
            if (inputTask.trim()) {
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
            value={inputTask}
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
                <p className="text-[9px] uppercase font-bold tracking-wider text-text-tertiary">
                  Logged Accomplishments:
                </p>
                <div className="flex flex-col gap-1">
                  {sessionAccomplishments.map((note, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-text-primary leading-relaxed flex items-start gap-1.5"
                    >
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
                onClick={handleSaveNoteClick}
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
              disabled={!inputTask.trim()}
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
                onClick={resumeSession}
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
                onClick={pauseSession}
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
              onClick={() => handleEndSessionClick("completed")}
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
              onClick={() => handleEndSessionClick("stopped")}
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
              onClick={startAnother}
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
