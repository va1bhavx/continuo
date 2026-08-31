import { useEffect, useState, useMemo } from "react";
import { CheckCheck, ChevronLeft, CircleStop, Dot, Search, X } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { FocusSession } from "../../lib/data/mock-data";

export const formatStartTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDuration = (startedAt: number, endedAt: number) => {
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

export const formatTotalDuration = (totalMs: number) => {
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

export const getLocalDateString = (timestamp: number) => {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDayLabel = (timestamp: number) => {
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
  const [referenceTime, setReferenceTime] = useState(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "stopped">("all");
  const [timeframeFilter, setTimeframeFilter] = useState<"all" | "today" | "yesterday" | "7days" | "30days">("all");
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "medium" | "long">("all");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AppStorage.getHistory();
        setHistoryData(data);
        setReferenceTime(Date.now());
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || timeframeFilter !== "all" || durationFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTimeframeFilter("all");
    setDurationFilter("all");
  };

  // Filter and group history data
  const groups = useMemo(() => {
    const filtered = historyData.filter((session) => {
      // 1. Text Search Filter (Title or accomplishment note)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(query);
        const matchesAccomplishment =
          session.accomplishment?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesAccomplishment) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "all" && session.status !== statusFilter) {
        return false;
      }

      // 3. Timeframe Filter
      if (timeframeFilter !== "all") {
        const sessionTime = session.startedAt;
        const now = referenceTime;

        if (timeframeFilter === "today") {
          const todayStart = new Date(now).setHours(0, 0, 0, 0);
          if (sessionTime < todayStart) return false;
        } else if (timeframeFilter === "yesterday") {
          const yesterdayStart = new Date(now);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          yesterdayStart.setHours(0, 0, 0, 0);
          const todayStart = new Date(now).setHours(0, 0, 0, 0);
          if (sessionTime < yesterdayStart.getTime() || sessionTime >= todayStart) return false;
        } else if (timeframeFilter === "7days") {
          const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
          if (sessionTime < sevenDaysAgo) return false;
        } else if (timeframeFilter === "30days") {
          const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
          if (sessionTime < thirtyDaysAgo) return false;
        }
      }

      // 4. Duration Filter
      if (durationFilter !== "all") {
        const durationMs = session.endedAt - session.startedAt;
        const durationMins = durationMs / (1000 * 60);
        if (durationFilter === "short" && durationMins >= 15) return false;
        if (durationFilter === "medium" && (durationMins < 15 || durationMins > 45)) return false;
        if (durationFilter === "long" && durationMins <= 45) return false;
      }

      return true;
    });

    // Group sessions by day key
    const groupedMap: { [key: string]: FocusSession[] } = {};
    filtered.forEach((session) => {
      const key = getLocalDateString(session.startedAt);
      if (!groupedMap[key]) {
        groupedMap[key] = [];
      }
      groupedMap[key].push(session);
    });

    const sortedKeys = Object.keys(groupedMap).sort((a, b) => b.localeCompare(a));

    return sortedKeys.map((key) => {
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
  }, [historyData, searchQuery, statusFilter, timeframeFilter, durationFilter, referenceTime]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-medium">
        Loading history...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 animate-fade-in max-w-2xl mx-auto text-left">
      <button
        onClick={() => navigation.setView("main")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit text-sm font-medium cursor-pointer bg-transparent border-0 outline-none"
      >
        <ChevronLeft size={18} />
        <span>Back to New Tab</span>
      </button>

      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            History
          </h1>
          <p className="text-text-secondary text-sm">What you've worked on.</p>
        </div>

        {historyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-border rounded-lg bg-surface/70 backdrop-blur-md text-center gap-2 mt-2">
            <p className="text-sm font-medium text-text-primary">
              No focus sessions yet
            </p>
            <p className="text-xs text-text-secondary">
              Complete your first session on the dashboard to see history here.
            </p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full animate-fade-in mt-1">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-md border border-border bg-surface-2/40 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-soft-border focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer bg-transparent border-0 p-0 outline-none"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Select Dropdowns */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-md border border-border bg-surface/70 text-sm text-text-primary focus:outline-none focus:border-accent-soft-border cursor-pointer appearance-none relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a897' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all" className="bg-surface text-text-primary">All Statuses</option>
                  <option value="completed" className="bg-surface text-text-primary">Completed</option>
                  <option value="stopped" className="bg-surface text-text-primary">Stopped</option>
                </select>

                <select
                  value={timeframeFilter}
                  onChange={(e: any) => setTimeframeFilter(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-md border border-border bg-surface/70 text-sm text-text-primary focus:outline-none focus:border-accent-soft-border cursor-pointer appearance-none relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a897' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all" className="bg-surface text-text-primary">All Time</option>
                  <option value="today" className="bg-surface text-text-primary">Today</option>
                  <option value="yesterday" className="bg-surface text-text-primary">Yesterday</option>
                  <option value="7days" className="bg-surface text-text-primary">Last 7 Days</option>
                  <option value="30days" className="bg-surface text-text-primary">Last 30 Days</option>
                </select>

                <select
                  value={durationFilter}
                  onChange={(e: any) => setDurationFilter(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-md border border-border bg-surface/70 text-sm text-text-primary focus:outline-none focus:border-accent-soft-border cursor-pointer appearance-none relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a897' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="all" className="bg-surface text-text-primary">All Durations</option>
                  <option value="short" className="bg-surface text-text-primary">Short (&lt; 15m)</option>
                  <option value="medium" className="bg-surface text-text-primary">Medium (15-45m)</option>
                  <option value="long" className="bg-surface text-text-primary">Long (&gt; 45m)</option>
                </select>
              </div>
            </div>

            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-border rounded-lg bg-surface/70 backdrop-blur-md text-center gap-3 mt-2 animate-fade-in">
                <p className="text-sm font-medium text-text-primary">
                  No history matches your filters
                </p>
                <p className="text-xs text-text-secondary">
                  Try adjusting your search term, status, timeframe, or duration filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="h-8 px-4 mt-1 rounded-md text-xs font-semibold bg-accent text-accent-text! hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 cursor-pointer border-0"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8 mt-2">
                {groups.map((group) => (
                  <div key={group.key} className="flex flex-col gap-3">
                    {/* Group Header Row */}
                    <div className="flex justify-between items-baseline border-b border-border/40 pb-2 px-1">
                      <h2 className="font-semibold text-base text-text-primary">
                        {group.dateLabel}
                      </h2>
                      <span className="text-xs text-text-secondary font-medium tracking-wide">
                        {group.totalDurationStr} • {group.totalSessions}{" "}
                        {group.totalSessions === 1 ? "session" : "sessions"}
                      </span>
                    </div>

                    {/* Sessions List Card */}
                    <div className="flex flex-col divide-y divide-border/40 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 overflow-hidden">
                      {group.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 flex items-center justify-between gap-4 transition-colors hover:bg-surface-hover/20"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
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
                            <div className="flex flex-col gap-0.5 text-left min-w-0 flex-1">
                              <h3 className="text-sm font-medium text-text-primary break-words">
                                {session.title}
                              </h3>
                              {/* Display optional accomplishment if present */}
                              {(session as any).accomplishment && (
                                <p className="text-xs text-text-secondary italic break-words">
                                  “{(session as any).accomplishment}”
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
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
          </>
        )}
      </section>
    </div>
  );
}
