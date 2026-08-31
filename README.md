# Continuo 

> **A New Tab built around what you're working on.**

Continuo is a minimal, focused Chrome extension designed to help you stay connected to your work. Every time you open a new tab, Continuo shows you your current intention, a ticking stopwatch, and your daily accomplishments. 

No feeds, no notifications, no competitive streaks, and no distractions. Just a quiet space to continue what you started.

---

## ✨ Core Features

*   **Intention Focus**: Set your current task and start working. The timer syncs with the browser tab title so you can track progress at a glance.
*   **Stopwatch Timer with Pause/Resume**: Active focus stopwatch (`HH:MM:SS`) with seamless pause and resume capabilities that maintain exact elapsed time across tab reloads.
*   **Accomplishment Log**: Log what you accomplished upon completing or stopping a focus session to build a history of achievements.
*   **Focus Statistics Dashboard**: Track your productivity with key metrics (Total Focus Time, Success Rate, Average Duration) and beautiful visualizations including a 7-day SVG bar trend chart and a circular completion ring.
*   **Gamified Achievements System**: Unlock 50 unique achievements across focus milestones, customizations, quick links, and filtering. Includes custom arpeggio audio chimes and reactive toast notifications.
*   **Focus Tasks & Daily Schedule**: Slide-out drawers for a Tasks (To-Do) checklist (linkable to history sessions) and a Time Table planner with browser desktop reminders supporting Daily recurring and One-time schedule blocks.
*   **Daily Focus Streaks**: Maintain daily streaks by completing focus sessions of 3+ minutes, highlighted by a glowing header flame indicator.
*   **Reorderable Quick Links Dock**: Centered dashboard shortcuts dock with fluid drag-and-drop reordering powered by `@dnd-kit`.
*   **History Panel with Search & Filter**: Search logs by keywords and filter by session Status, Timeframe (Today, Yesterday, 7 Days, 30 Days), or Duration categories.
*   **Settings & Customization**:
    *   Cycle between high-quality background wallpapers, a solid dark theme, or paste custom wallpaper URLs.
    *   Toggle seconds display in the live header clock.
    *   Switch between 12-hour AM/PM and 24-hour clock formats.
    *   Toggle audio alert sound chimes and tab title timer sync.
*   **Safety Modals & Micro-animations**: Confirm destructive operations (e.g. clearing history) with double-check modal overlays and enjoy smooth transition wipe sweep animations when switching wallpapers.
*   **100% Local Privacy**: Your data is yours. Continuo stores everything inside `chrome.storage.local`. No external servers, no tracking, and zero telemetry.

---

## 🛠️ Tech Stack & Architecture

*   **Framework**: React 19 (TypeScript)
*   **Build Tool**: Vite 8
*   **Styling**: Tailwind CSS 4
*   **Icons**: Lucide React
*   **Testing**: Vitest + Happy-DOM
*   **Linter**: Oxlint (ultra-fast linter)

---

## 🚀 Developer Setup

Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Local Development Server
To launch the React dashboard fallback in your browser:
```bash
pnpm dev
```

### 3. Run Automated Tests
Runs the formatting, helper, and storage integration test suites:
```bash
pnpm test
```

### 4. Build for Production
Compiles optimization bundles into the `/dist` directory:
```bash
pnpm build
```

---

## 📦 Loading in Chrome (Extension Mode)

1. Run the build script to compile the bundle:
   ```bash
   pnpm build
   ```
2. Open Google Chrome and navigate to: `chrome://extensions/`
3. Toggle **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left.
5. Select the **`dist`** folder from this project directory.
6. Open a new tab to see Continuo in action!

---

## 📄 Privacy & License
Continuo operates entirely locally. All permissions declared (`storage`, `notifications`) are used exclusively for caching preferences, syncing active timers across multiple tabs, delivering schedule reminders, and overriding the browser new tab layout.

Developed with care by **va1bhavx**.
