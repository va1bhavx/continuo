import { useEffect, useState } from "react";
import {
  X,
  Clock,
  Trash2,
  Bell,
  Check,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useSchedules } from "../../hooks/useSchedules";
import { triggerToast } from "../../utils/toast";

interface ScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Formats 24h clock string "14:30" to readable "02:30 PM"
export const format12Hour = (time24: string) => {
  if (!time24) return "";
  const [hrsStr, minsStr] = time24.split(":");
  const hrs = parseInt(hrsStr, 10);
  const ampm = hrs >= 12 ? "PM" : "AM";
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  return `${displayHrs.toString().padStart(2, "0")}:${minsStr} ${ampm}`;
};

export default function ScheduleDrawer({
  isOpen,
  onClose,
}: ScheduleDrawerProps) {
  const {
    upcomingSlots,
    historySlots,
    loading,
    addSlot,
    completeSlot,
    cancelSlot,
    restoreSlot,
    permanentlyDeleteSlot,
  } = useSchedules();

  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"daily" | "once">("daily");
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (!isOpen) return;

    // If running as Chrome Extension, the 'notifications' manifest permission automatically grants it
    if (typeof chrome !== "undefined" && chrome.notifications) {
      setNotifPermission("granted");
    } else if (typeof Notification !== "undefined") {
      // Check & request browser notification permissions
      setNotifPermission(Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          setNotifPermission(perm);
          if (perm === "denied") {
            triggerToast({
              message:
                "Notifications declined. Enable them in your browser settings to receive real-time schedule alerts.",
            });
          }
        });
      }
    }
  }, [isOpen]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !time) return;

    await addSlot(time, cleanTitle, description, type);

    setTitle("");
    setTime("");
    setDescription("");
    setType("daily");
  };

  if (!isOpen) return null;

  const totalSlotsCount = upcomingSlots.length + historySlots.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-start pointer-events-none">
      {/* Click-away backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-xs pointer-events-auto"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full h-screen bg-surface/95 backdrop-blur-lg border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto animate-slide-right text-shadow-none text-left">
        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Daily Schedule
            </h2>
            <p className="text-[10px] text-text-secondary">
              Plan your slots & view completed history
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Permission warning if blocked */}
          {notifPermission === "denied" && (
            <div className="p-2.5 rounded bg-danger/10 border border-danger/20 text-[10px] text-danger flex items-start gap-2 leading-normal">
              <Bell size={14} className="shrink-0 mt-0.5" />
              <span>
                Notifications are blocked. Enable them in your browser settings
                to receive timetable reminders.
              </span>
            </div>
          )}

          {/* Add Time Slot Form */}
          <form onSubmit={handleAddSlot} className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="col-span-1 h-8 px-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "daily" | "once")}
                className="col-span-2 h-8 px-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="daily">Daily Reminder</option>
                <option value="once">One-time Reminder</option>
              </select>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Topic..."
              required
              className="w-full h-8 px-2.5 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Topic description (optional)..."
              rows={2}
              className="w-full p-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
            />
            <button
              type="submit"
              className="w-full h-8 rounded bg-accent text-accent-text! font-medium text-xs hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              Add Time Slot
            </button>
          </form>

          {/* Timeline Schedule */}
          {loading ? (
            <div className="text-center text-xs text-text-secondary py-8">
              Loading schedule...
            </div>
          ) : totalSlotsCount === 0 ? (
            <div className="text-center text-xs text-text-secondary py-12 space-y-1 bg-surface-hover/10 rounded-lg p-4 border border-dashed border-border/40">
              <p className="font-semibold text-text-primary">
                No slots scheduled
              </p>
              <p className="text-[10px]">
                Divide your day into focus chunks to optimize tasks.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* UPCOMING SECTION */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-wider font-bold text-accent">
                  Upcoming ({upcomingSlots.length})
                </h3>

                {upcomingSlots.length === 0 ? (
                  <p className="text-[10px] text-text-tertiary italic">
                    No upcoming slots for today.
                  </p>
                ) : (
                  <div className="relative pl-4 border-l border-dashed border-border/60 ml-2.5 space-y-4">
                    {upcomingSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="relative group/slot flex items-start justify-between gap-3 text-shadow-none"
                      >
                        {/* Timeline bullet dot */}
                        <span className="absolute -left-[20px] top-[14px] w-2 h-2 rounded-full bg-accent ring-4 ring-bg border border-accent-soft-border shrink-0" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-accent flex-wrap">
                            <Clock size={11} />
                            <span className="text-[10px] font-bold tracking-tight">
                              {format12Hour(slot.time)}
                            </span>
                            <span className="text-[8px] uppercase px-1 py-0.5 rounded bg-accent/10 border border-accent/25 font-bold tracking-wider text-accent shrink-0 select-none">
                              {slot.type === "once" ? "Once" : "Daily"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-text-primary mt-1 break-words">
                            {slot.title}
                          </h4>
                          {slot.description && (
                            <p className="text-[10px] text-text-secondary mt-0.5 leading-normal break-words">
                              {slot.description}
                            </p>
                          )}
                        </div>

                        {/* Actions: Complete (✓) and Cancel (×) */}
                        <div className="flex items-center gap-1 shrink-0 mt-1">
                          <button
                            onClick={() => completeSlot(slot.id)}
                            className="p-1 rounded text-text-secondary hover:text-accent hover:bg-surface-hover transition-colors cursor-pointer border-0 bg-transparent"
                            title="Mark as completed"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => cancelSlot(slot.id)}
                            className="p-1 rounded text-text-secondary hover:text-danger hover:bg-surface-hover transition-colors cursor-pointer border-0 bg-transparent"
                            title="Cancel slot"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* HISTORY SECTION */}
              {historySlots.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-border/40">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-text-secondary">
                    History ({historySlots.length})
                  </h3>

                  <div className="space-y-2">
                    {historySlots.map((slot) => {
                      const isCompleted = slot.status === "completed";
                      const isMissed = slot.status === "missed";
                      const isCancelled = slot.status === "cancelled";

                      return (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-lg bg-surface/30 border border-border/30 flex items-start justify-between gap-2.5 opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="mt-0.5 shrink-0">
                              {isCompleted && (
                                <CheckCircle2
                                  size={13}
                                  className="text-accent fill-accent/10"
                                />
                              )}
                              {isMissed && (
                                <AlertCircle
                                  size={13}
                                  className="text-amber-400"
                                />
                              )}
                              {isCancelled && (
                                <XCircle
                                  size={13}
                                  className="text-text-tertiary"
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-text-tertiary">
                                  {format12Hour(slot.time)}
                                </span>
                                <span
                                  className={`text-[8px] uppercase px-1 py-0.2 rounded font-bold tracking-wider ${
                                    isCompleted
                                      ? "bg-accent/10 text-accent"
                                      : isMissed
                                        ? "bg-amber-400/10 text-amber-400"
                                        : "bg-surface-hover text-text-tertiary"
                                  }`}
                                >
                                  {slot.status}
                                </span>
                              </div>
                              <h4
                                className={`text-xs mt-0.5 break-words font-medium ${
                                  isCancelled
                                    ? "line-through text-text-tertiary"
                                    : "text-text-secondary"
                                }`}
                              >
                                {slot.title}
                              </h4>
                              {slot.description && (
                                <p className="text-[9px] text-text-tertiary mt-0.5 leading-normal break-words line-clamp-1">
                                  {slot.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 mt-0.5">
                            <button
                              onClick={() => restoreSlot(slot.id)}
                              className="p-1 rounded text-text-tertiary hover:text-accent transition-colors border-0 bg-transparent cursor-pointer"
                              title="Re-schedule slot"
                            >
                              <RotateCcw size={12} />
                            </button>
                            <button
                              onClick={() => permanentlyDeleteSlot(slot.id)}
                              className="p-1 rounded text-text-tertiary hover:text-danger transition-colors border-0 bg-transparent cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
