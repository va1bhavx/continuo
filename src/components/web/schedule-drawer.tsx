import { useEffect, useState } from "react";
import { X, Clock, Trash2, Bell } from "lucide-react";
import { AppStorage } from "../../lib/storage";
import type { ScheduleSlot } from "../../lib/storage";

interface ScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Formats 24h clock string "14:30" to readable "02:30 PM"
const format12Hour = (time24: string) => {
  if (!time24) return "";
  const [hrsStr, minsStr] = time24.split(":");
  const hrs = parseInt(hrsStr, 10);
  const ampm = hrs >= 12 ? "PM" : "AM";
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  return `${displayHrs.toString().padStart(2, "0")}:${minsStr} ${ampm}`;
};

export default function ScheduleDrawer({ isOpen, onClose }: ScheduleDrawerProps) {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (!isOpen) return;

    // Check & request browser notification permissions
    if (typeof Notification !== "undefined") {
      setNotifPermission(Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          setNotifPermission(perm);
        });
      }
    }

    const loadSchedule = async () => {
      try {
        const saved = await AppStorage.getSchedule();
        setSchedule(saved);
      } catch (e) {
        console.error("Failed to load schedule:", e);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [isOpen]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !time) return;

    const newSlot: ScheduleSlot = {
      id: `slot_${Date.now()}`,
      time: time,
      title: cleanTitle,
      description: description.trim(),
      notified: false
    };

    // Add and sort slots chronologically
    const updated = [...schedule, newSlot].sort((a, b) => a.time.localeCompare(b.time));
    setSchedule(updated);
    await AppStorage.saveSchedule(updated);

    setTitle("");
    setTime("");
    setDescription("");

    // Dispatch custom event to notify App.tsx that schedule updated
    window.dispatchEvent(new CustomEvent("schedule-update"));
  };

  const handleDeleteSlot = async (id: string) => {
    const updated = schedule.filter((s) => s.id !== id);
    setSchedule(updated);
    await AppStorage.saveSchedule(updated);
    window.dispatchEvent(new CustomEvent("schedule-update"));
  };

  if (!isOpen) return null;

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
            <h2 className="text-sm font-bold text-text-primary">Daily Schedule</h2>
            <p className="text-[10px] text-text-secondary">Plan your slots & receive desktop notifications</p>
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
              <span>Notifications are blocked. Enable them in your browser settings to receive timetable reminders.</span>
            </div>
          )}

          {/* Add Time Slot Form */}
          <form onSubmit={handleAddSlot} className="space-y-2.5 p-3 rounded-lg bg-surface-hover/20 border border-border/40">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="col-span-1 h-8 px-2 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Topic..."
                required
                className="col-span-2 h-8 px-2.5 rounded bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
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
            <div className="text-center text-xs text-text-secondary py-8">Loading schedule...</div>
          ) : schedule.length === 0 ? (
            <div className="text-center text-xs text-text-secondary py-12 space-y-1 bg-surface-hover/10 rounded-lg p-4 border border-dashed border-border/40">
              <p className="font-semibold text-text-primary">No slots added today</p>
              <p className="text-[10px]">Divide your day into focus chunks to optimize tasks.</p>
            </div>
          ) : (
            <div className="relative pl-4 border-l border-dashed border-border/60 ml-2.5 space-y-5">
              {schedule.map((slot) => (
                <div key={slot.id} className="relative group/slot flex items-start justify-between gap-3 text-shadow-none">
                  {/* Timeline bullet dot */}
                  <span className="absolute -left-[20px] top-[14px] w-2 h-2 rounded-full bg-accent ring-4 ring-bg border border-accent-soft-border shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-accent">
                      <Clock size={11} />
                      <span className="text-[10px] font-bold tracking-tight">{format12Hour(slot.time)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-text-primary mt-1 break-words">{slot.title}</h4>
                    {slot.description && (
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-normal break-words">{slot.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-text-secondary hover:text-danger transition-colors self-start mt-1 cursor-pointer border-0 bg-transparent p-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
