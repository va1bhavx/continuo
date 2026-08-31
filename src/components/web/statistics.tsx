import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, Clock, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { FocusSession } from "../../lib/data/mock-data";
import { getLocalDateString } from "./history";


// Generates the last N dates with labels
const getLastNDays = (n: number) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    dates.push({ dateStr, label });
  }
  return dates;
};

// Formats total duration for display
const formatHoursAndMinutes = (totalMs: number) => {
  const totalMinutes = Math.round(totalMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function Statistics() {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AppStorage.getHistory();
        setHistoryData(data);
      } catch (error) {
        console.error("Failed to load statistics history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Compute overall KPI metrics
  const stats = useMemo(() => {
    const totalSessions = historyData.length;
    const completedSessions = historyData.filter((s) => s.status === "completed").length;
    const stoppedSessions = totalSessions - completedSessions;
    const successRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    let totalDurationMs = 0;
    historyData.forEach((s) => {
      if (s.status === "completed") {
        totalDurationMs += s.endedAt - s.startedAt;
      }
    });

    const averageDurationMin =
      completedSessions > 0 ? Math.round(totalDurationMs / completedSessions / (1000 * 60)) : 0;

    return {
      totalSessions,
      completedSessions,
      stoppedSessions,
      successRate,
      totalDurationStr: formatHoursAndMinutes(totalDurationMs),
      averageDurationMin,
    };
  }, [historyData]);

  // Compute 7-day focus chart trend data
  const chartData = useMemo(() => {
    const days = getLastNDays(7);
    const sessionMap: { [key: string]: number } = {};

    historyData.forEach((session) => {
      if (session.status === "completed") {
        const dateKey = getLocalDateString(session.startedAt);
        const durationMin = (session.endedAt - session.startedAt) / (1000 * 60);
        sessionMap[dateKey] = (sessionMap[dateKey] || 0) + durationMin;
      }
    });

    return days.map((day) => ({
      label: day.label,
      value: Math.round(sessionMap[day.dateStr] || 0),
    }));
  }, [historyData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-medium">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 animate-fade-in max-w-2xl mx-auto text-left">
      {/* Back navigation */}
      <button
        onClick={() => navigation.setView("main")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit text-sm font-medium cursor-pointer bg-transparent border-0 outline-none"
      >
        <ChevronLeft size={18} />
        <span>Back to New Tab</span>
      </button>

      {/* Title */}
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Statistics
          </h1>
          <p className="text-text-secondary text-sm">Analyze your focus logs and trends.</p>
        </div>

        {stats.totalSessions === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-border rounded-lg bg-surface/70 backdrop-blur-md text-center gap-2 mt-2">
            <p className="text-sm font-medium text-text-primary">
              No stats available yet
            </p>
            <p className="text-xs text-text-secondary">
              Complete focus sessions on your dashboard to populate visual stats.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-2">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex items-center gap-3">
                <div className="p-2 rounded bg-accent/10 text-accent">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Total Focus Time</p>
                  <p className="text-lg font-bold text-text-primary">{stats.totalDurationStr}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex items-center gap-3">
                <div className="p-2 rounded bg-accent/10 text-accent">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Average Session</p>
                  <p className="text-lg font-bold text-text-primary">{stats.averageDurationMin} min</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex items-center gap-3">
                <div className="p-2 rounded bg-check/10 text-check">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Completed Sessions</p>
                  <p className="text-lg font-bold text-text-primary">{stats.completedSessions}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex items-center gap-3">
                <div className="p-2 rounded bg-danger/10 text-danger">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary">Stopped Sessions</p>
                  <p className="text-lg font-bold text-text-primary">{stats.stoppedSessions}</p>
                </div>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-semibold text-text-primary">Last 7 Days Trend</h3>
                <span className="text-xs text-text-secondary">Minutes Focused</span>
              </div>
              <SVGBarChart data={chartData} />
            </div>

            {/* Donut Chart / Progress Ring card */}
            <div className="p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20 flex items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-sm font-semibold text-text-primary">Session Completion Rate</h3>
                <p className="text-xs text-text-secondary">
                  Percentage of focus intentions fully completed.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-check" />
                  <span className="text-xs text-text-primary">{stats.completedSessions} Completed</span>
                  <span className="w-2 h-2 rounded-full bg-danger ml-2" />
                  <span className="text-xs text-text-primary">{stats.stoppedSessions} Stopped</span>
                </div>
              </div>

              <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    className="stroke-border-strong/30"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active Segment Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    className="stroke-accent"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={
                      2 * Math.PI * 38 * (1 - stats.successRate / 100)
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-text-primary">
                  {stats.successRate}%
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

interface SVGBarChartProps {
  data: { label: string; value: number }[];
}

function SVGBarChart({ data }: SVGBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 120;
  const chartWidth = 500;
  const barPadding = 18;
  const numBars = data.length;
  const availableWidth = chartWidth - (numBars - 1) * barPadding;
  const barWidth = availableWidth / numBars;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
        className="w-full overflow-visible"
      >
        {data.map((item, idx) => {
          const barHeight = (item.value / maxVal) * chartHeight;
          const x = idx * (barWidth + barPadding);
          const y = chartHeight - barHeight;

          return (
            <g key={idx} className="group">
              {/* Tooltip Title text shown on hover */}
              <title>{`${item.value} mins`}</title>

              {/* Background hover highlights */}
              <rect
                x={x - barPadding / 4}
                y={0}
                width={barWidth + barPadding / 2}
                height={chartHeight + 25}
                className="fill-transparent group-hover:fill-surface-hover/10 transition-colors duration-150 rounded"
                rx="4"
              />

              {/* Focus minutes text (appears above bar on hover or always if > 0) */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className={`text-[9px] font-bold fill-text-primary transition-opacity duration-150 ${
                  item.value > 0
                    ? "opacity-80 group-hover:opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {item.value > 0 ? `${item.value}m` : "0m"}
              </text>

              {/* Bar shape */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 3)} // Ensure small indicator for 0
                className="fill-accent transition-all duration-350 ease-out"
                rx="4"
              />

              {/* Axis Label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-text-secondary"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
