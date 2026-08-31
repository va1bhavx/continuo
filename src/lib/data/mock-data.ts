export type SessionStatus = "completed" | "stopped";

export interface FocusSession {
  id: string;

  title: string;

  startedAt: number;
  endedAt: number;

  status: SessionStatus;

  createdAt: number;
  accomplishment?: string;
  accomplishments?: string[];
}

export const HISTORY_DATA: FocusSession[] = [
  {
    id: "session_001",
    title: "Build authentication API",
    startedAt: new Date("2026-08-26T10:17:00").getTime(),
    endedAt: new Date("2026-08-26T11:30:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-26T10:17:00").getTime(),
  },
  {
    id: "session_002",
    title: "Fix mobile navigation",
    startedAt: new Date("2026-08-26T09:02:00").getTime(),
    endedAt: new Date("2026-08-26T09:47:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-26T09:02:00").getTime(),
  },
  {
    id: "session_003",
    title: "Update portfolio project cards",
    startedAt: new Date("2026-08-26T08:11:00").getTime(),
    endedAt: new Date("2026-08-26T08:56:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-26T08:11:00").getTime(),
  },
  {
    id: "session_004",
    title: "Design system audit",
    startedAt: new Date("2026-08-25T16:20:00").getTime(),
    endedAt: new Date("2026-08-25T17:08:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-25T16:20:00").getTime(),
  },
  {
    id: "session_005",
    title: "Write API documentation",
    startedAt: new Date("2026-08-25T14:05:00").getTime(),
    endedAt: new Date("2026-08-25T14:42:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-25T14:05:00").getTime(),
  },
  {
    id: "session_006",
    title: "Explore WebSocket reconnect logic",
    startedAt: new Date("2026-08-25T11:18:00").getTime(),
    endedAt: new Date("2026-08-25T12:04:00").getTime(),
    status: "stopped",
    createdAt: new Date("2026-08-25T11:18:00").getTime(),
  },
  {
    id: "session_007",
    title: "Debug CI pipeline",
    startedAt: new Date("2026-08-25T09:12:00").getTime(),
    endedAt: new Date("2026-08-25T10:01:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-25T09:12:00").getTime(),
  },
  {
    id: "session_008",
    title: "Refactor auth middleware",
    startedAt: new Date("2026-08-24T15:30:00").getTime(),
    endedAt: new Date("2026-08-24T16:26:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-24T15:30:00").getTime(),
  },
  {
    id: "session_009",
    title: "Improve dashboard loading state",
    startedAt: new Date("2026-08-24T13:15:00").getTime(),
    endedAt: new Date("2026-08-24T14:02:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-24T13:15:00").getTime(),
  },
  {
    id: "session_010",
    title: "Investigate API timeout issue",
    startedAt: new Date("2026-08-24T10:42:00").getTime(),
    endedAt: new Date("2026-08-24T11:19:00").getTime(),
    status: "stopped",
    createdAt: new Date("2026-08-24T10:42:00").getTime(),
  },
  {
    id: "session_011",
    title: "Implement form validation",
    startedAt: new Date("2026-08-23T16:08:00").getTime(),
    endedAt: new Date("2026-08-23T17:21:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-23T16:08:00").getTime(),
  },
  {
    id: "session_012",
    title: "Review pull requests",
    startedAt: new Date("2026-08-23T14:12:00").getTime(),
    endedAt: new Date("2026-08-23T14:48:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-23T14:12:00").getTime(),
  },
  {
    id: "session_013",
    title: "Set up Chrome extension storage",
    startedAt: new Date("2026-08-23T10:05:00").getTime(),
    endedAt: new Date("2026-08-23T11:32:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-23T10:05:00").getTime(),
  },
  {
    id: "session_014",
    title: "Create empty states for settings",
    startedAt: new Date("2026-08-22T15:40:00").getTime(),
    endedAt: new Date("2026-08-22T16:17:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-22T15:40:00").getTime(),
  },
  {
    id: "session_015",
    title: "Experiment with background images",
    startedAt: new Date("2026-08-22T12:20:00").getTime(),
    endedAt: new Date("2026-08-22T12:46:00").getTime(),
    status: "stopped",
    createdAt: new Date("2026-08-22T12:20:00").getTime(),
  },
  {
    id: "session_016",
    title: "Optimize React component structure",
    startedAt: new Date("2026-08-22T09:30:00").getTime(),
    endedAt: new Date("2026-08-22T10:44:00").getTime(),
    status: "completed",
    createdAt: new Date("2026-08-22T09:30:00").getTime(),
  },
];
