# Continuo 

> **A New Tab built around what you're working on.**

Continuo is a minimal, focused Chrome extension designed to help you stay connected to your work. Every time you open a new tab, Continuo shows you your current intention, a ticking stopwatch, and your daily accomplishments. 

No feeds, no notifications, no competitive streaks, and no distractions. Just a quiet space to continue what you started.

---

## ✨ Core Features

*   **Intention Focus**: Set your current task and start working. The timer syncs with the browser tab title so you can track progress at a glance.
*   **Stopwatch Timer**: Active focus stopwatch (`HH:MM:SS`) to keep you accountable. Supports starting directly via the **Enter** key.
*   **Accomplishment Log**: Log what you accomplished upon completing or stopping a focus session.
*   **Reorderable Quick Links**: Clean list of shortcuts on your dashboard with fluid drag-and-drop sorting controls in the settings.
*   **History Panel**: Daily-grouped cards summarizing focus logs, task outcomes, start times, durations, and accomplishment notes.
*   **Settings & Customization**:
    *   Cycle between high-quality background wallpapers or a solid dark theme.
    *   Toggle seconds in the live header clock.
    *   Switch between 12-hour AM/PM and 24-hour formats.
    *   Toggle audio alert sound chimes.
    *   Toggle tab title timer sync.
*   **Safety Modals & Toasts**: Double-check destructive actions with confirmation overlays, accompanied by sleek toast notification alerts.
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
Continuo operates entirely locally. All permissions declared (`storage`, `tabs`) are used exclusively for caching preferences, syncing active timers across multiple tabs, and overriding the browser new tab layout.

Developed with care by **va1bhavx**.
