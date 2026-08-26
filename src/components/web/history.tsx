import { useEffect, useState } from "react";
import { CheckCheck, ChevronLeft, CircleStop, Dot } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { FocusSession } from "../../lib/data/mock-data";

const formatStartTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDuration = (startedAt: number, endedAt: number) => {
  const durationMs = endedAt - startedAt;
  const durationMinutes = Math.round(durationMs / (1000 * 60));
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
};

const formatTotalDuration = (totalMs: number) => {
  const totalMinutes = Math.round(totalMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
};

const getLocalDateString = (timestamp: number) => {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDayLabel = (timestamp: number) => {
  const sessionDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  if (
    sessionDate.getDate() === yesterday.getDate() &&
    sessionDate.getMonth() === yesterday.getMonth() &&
    sessionDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return sessionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function History() {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AppStorage.getHistory();
        setHistoryData(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-medium">
        Loading history...
      </div>
    );
  }

  // Group sessions by day key
  const groupedMap: { [key: string]: FocusSession[] } = {};
  historyData.forEach((session) => {
    const key = getLocalDateString(session.startedAt);
    if (!groupedMap[key]) {
      groupedMap[key] = [];
    }
    groupedMap[key].push(session);
  });

  const sortedKeys = Object.keys(groupedMap).sort((a, b) => b.localeCompare(a));

  const groups = sortedKeys.map((key) => {
    const sessions = groupedMap[key];
    const dateLabel = getDayLabel(sessions[0].startedAt);
    const totalMs = sessions.reduce(
      (acc, s) => acc + (s.endedAt - s.startedAt),
      0,
    );
    const totalDurationStr = formatTotalDuration(totalMs);
    const totalSessions = sessions.length;

    return {
      key,
      dateLabel,
      totalDurationStr,
      totalSessions,
      sessions,
    };
  });

  return (
    <div className="flex flex-col gap-8 px-4 py-8 animate-fade-in">
      <button
        onClick={() => navigation.setView("main")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit text-sm font-medium cursor-pointer bg-transparent border-0 outline-none"
      >
        <ChevronLeft size={18} />
        <span>Back to tab</span>
      </button>

      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            History
          </h1>
          <p className="text-text-secondary text-sm">What you've worked on.</p>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-surface/20 text-center gap-2 mt-4">
            <p className="text-sm font-medium text-text-primary">
              No focus sessions yet
            </p>
            <p className="text-xs text-text-secondary">
              Complete your first session on the dashboard to see history here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 mt-2">
            {groups.map((group) => (
              <div key={group.key} className="flex flex-col gap-4">
                {/* Group Header Row */}
                <div className="flex justify-between items-baseline border-b border-border pb-2">
                  <h2 className="font-semibold text-lg text-text-primary">
                    {group.dateLabel}
                  </h2>
                  <span className="text-xs text-text-secondary font-medium tracking-wide">
                    {group.totalDurationStr} • {group.totalSessions}{" "}
                    {group.totalSessions === 1 ? "session" : "sessions"}
                  </span>
                </div>

                {/* Sessions List */}
                <div className="flex flex-col gap-3">
                  {group.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 border-b border-border-strong flex items-center justify-between transition-colors hover:bg-surface-hover/20 "
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {session.status === "completed" ? (
                            <CheckCheck className="text-accent" size={18} />
                          ) : (
                            <CircleStop
                              className="text-text-tertiary"
                              size={18}
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <h3 className="text-sm font-medium text-text-primary">
                            {session.title}
                          </h3>
                          {/* Display optional accomplishment if present */}
                          {(session as any).accomplishment && (
                            <p className="text-xs text-text-secondary italic">
                              “{(session as any).accomplishment}”
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <span>{formatStartTime(session.startedAt)}</span>
                        <Dot className="text-text-tertiary" size={16} />
                        <span>
                          {formatDuration(session.startedAt, session.endedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
