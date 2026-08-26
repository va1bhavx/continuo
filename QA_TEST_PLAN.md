# Continuo V1 - QA Test Plan & Verification Checklist

This test plan defines the test cases, procedures, and validation criteria for the **Continuo V1 Polish Pass**. It is designed to verify all UX/UI refinements, layout edge cases, navigation changes, and performance characteristics prior to release.

---

## 🛠️ Automated Test Data Setup (Mock Injector)

To quickly test edge cases (50+ history items, many quick links, long URLs, and long titles), copy and paste the following script into your browser's Developer Tools Console (`F12` -> **Console**):

```javascript
(function injectTestData() {
  const favorite_links = [];
  // 1. Generate 25 favorite links (Many Quick Links)
  for (let i = 1; i <= 25; i++) {
    favorite_links.push({
      id: `link_test_${i}`,
      label: i === 5 ? "SuperLongLabelThatWillGoOnAndOnAndTruncate" : `Quick Link ${i}`,
      url: i === 10 ? "https://www.extremely-long-subdomain-name-with-many-hyphens.com/path/to/some/nested/page/or/resource?query=1&param=true" : `https://example${i}.com`
    });
  }

  // 2. Generate 55 history items spanning 5 days (50+ history items)
  const focus_history = [];
  const statuses = ["completed", "stopped"];
  const tasks = [
    "Refactor state management in navigation context",
    "Fix edge case where seconds indicator overlays the minutes label when double digits occur in high load rendering states",
    "Design and polish the dashboard focus session status confirmation badge layout and color alignment",
    "Quick sync with design team on Continuo V1 premium cards",
    "Write documentation for chrome storage fallback",
    "Regular work session",
    "Write tests"
  ];
  const accomplishments = [
    "Completed all refactoring, cleaned up dead imports, and verified that everything works on both Chrome extension and web fallback versions",
    "Found the bug in rendering, optimized performance, and got the tab title sync working perfectly with the elapsed timer",
    "",
    "Discussed wallpaper transparency and contrast options",
    "Finished README.md updates and added standard installation instructions"
  ];

  const now = Date.now();
  for (let i = 1; i <= 55; i++) {
    const dayOffset = Math.floor(i / 11); // group in batches of 11 per day
    const startedAt = now - (dayOffset * 24 * 60 * 60 * 1000) - (i * 30 * 60 * 1000);
    const durationMinutes = 10 + (i % 50);
    const endedAt = startedAt + (durationMinutes * 60 * 1000);
    
    focus_history.push({
      id: `session_test_${i}`,
      title: i === 3 ? "Extremely long task title that goes on and on for testing the limits of text wrapping and overflow prevention in the new card view of the history page" : tasks[i % tasks.length],
      startedAt: startedAt,
      endedAt: endedAt,
      status: statuses[i % 2],
      createdAt: startedAt,
      accomplishment: i === 3 ? "A very long accomplishment note that stretches across multiple lines to verify that word wrapping works cleanly and does not push the time indicators or status indicators off the screen in small viewport profiles." : accomplishments[i % accomplishments.length]
    });
  }

  // Save to localStorage
  localStorage.setItem("favorite_links", JSON.stringify(favorite_links));
  localStorage.setItem("focus_history", JSON.stringify(focus_history));

  // Dispatch events to update UI immediately
  window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "favorite_links", newValue: favorite_links } }));
  window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "focus_history", newValue: focus_history } }));

  console.log("✅ Continuo V1 Test Data Injected Successfully!");
  console.log("  - 25 Quick Links added (including edge case long labels/URLs)");
  console.log("  - 55 History Items generated over multiple days");
  console.log("Refresh the page or check the UI to inspect long content and scroll layouts.");
})();
```

To clear injected test data and return to defaults, run `localStorage.clear()` and reload the tab.

---

## 📋 Comprehensive QA Checklist

### 1. Storage & State Persistence

#### 1.1 Fresh Installation
*   **Procedure:** Clear all browser storage (`localStorage.clear(); sessionStorage.clear();`) and reload.
*   **Validation:** 
    *   Verify the default wallpaper loads.
    *   Verify settings initialize to defaults (AM/PM format, show seconds, alert sound enabled).
    *   Verify "Saved Shortcuts" contains default links (GitHub, LinkedIn, Twitter).
    *   Verify History page shows empty state.

#### 1.2 Reload
*   **Procedure:** Start a focus session. Reload the page while the session is active.
*   **Validation:**
    *   Timer resumes from the correct elapsed time immediately upon loading (no jumping or resetting to 00:00:00).
    *   Running task name is preserved.

#### 1.3 Browser Restart
*   **Procedure:** Start a focus session. Close the browser tab or the entire window. Wait 30 seconds, then reopen.
*   **Validation:**
    *   Active timer resumes with elapsed duration calculated from original start time.
    *   No broken UI states or missing data.

#### 1.4 Closing Chrome during a Session
*   **Procedure:** Start a session, close Chrome completely. Reopen after 2 minutes.
*   **Validation:**
    *   Session calculates the correct time elapsed while closed and continues ticking normally.

---

### 2. Edge Case Content Layouts

#### 2.1 Long Task Names
*   **Procedure:** Type a task name exceeding 150 characters (or run the Mock Injector script).
*   **Validation:**
    *   **Running State:** Text wraps cleanly without overflowing the dashboard container. No horizontal scrolls.
    *   **Summary State:** The text wraps inside the summary header box, keeping action buttons centered.
    *   **History Page:** The text wraps cleanly inside the day list card without clipping or pushing start time/duration off-screen.

#### 2.2 Long URLs
*   **Procedure:** Add a shortcut with a URL exceeding 100 characters.
*   **Validation:**
    *   URL text in "Saved Shortcuts" wraps/truncates with ellipses (`truncate max-w-[200px] sm:max-w-md`) and does not push actions off-screen.

#### 2.3 50+ History Items
*   **Procedure:** Inject test data. Navigate to the History page.
*   **Validation:**
    *   Verify daily list groups are contained inside clean glassmorphic cards.
    *   Scroll works smoothly. No layout frame breaks.
    *   Accomplishment notes render in secondary text with italic style and clean wrapping.

#### 2.4 Many Quick Links
*   **Procedure:** Inject test data (adds 25 links). View the dashboard footer area.
*   **Validation:**
    *   Quick links wrap cleanly to multiple rows.
    *   The `+` (Add Link) button remains aligned nicely at the end or right section without wrapping into awkward vertical states.

#### 2.5 Empty States
*   **Procedure:** Clear data. View History page and "Saved Shortcuts" in Manage Links.
*   **Validation:**
    *   **History empty state:** Renders a clean card outline with a centered message.
    *   **Shortcuts empty state:** Renders a globe icon with low opacity and a centered message.

---

### 3. Session Flow & Confirmations

#### 3.1 Starting / Stopping Sessions
*   **Procedure:** Enter an intention and click **Start Focus**. Let it run for 5 seconds, then click **Stop**.
*   **Validation:**
    *   Tab title updates with timer (if enabled).
    *   Clicking **Stop** transitions UI to the summary state immediately.
    *   Summary header correctly displays "Focus Stopped".

#### 3.2 Completing Sessions
*   **Procedure:** Click **Start Focus**, wait, then click **Complete**.
*   **Validation:**
    *   Summary header correctly displays "Focus Completed".
    *   Play chime triggers (if sound enabled in Settings).
    *   A subtle confirmation badge appears under duration: `✓ Session ended & saved to history`.

---

### 4. Visual Polish & Settings

#### 4.1 Wallpaper Readability
*   **Procedure:** Cycle through all pre-installed wallpapers in Settings.
*   **Validation:**
    *   Text across all sections (Dashboard, Settings, History, About, Feedback) remains highly readable.
    *   Card containers utilize subtle dark opacity overlays (`bg-surface/70`) and `backdrop-blur-md` to block busy image details behind the text.

#### 4.2 Different Screen Sizes (Responsiveness)
*   **Procedure:** Resize browser window to mobile width (e.g. 375px), tablet width (768px), and desktop.
*   **Validation:**
    *   No horizontal overflow or clipped text.
    *   Inputs, textareas, and buttons adapt grid rows (e.g. wallpaper grid matches columns cleanly).
    *   Settings pages flex correctly.

#### 4.3 Light/Dark Mode
*   **Procedure:** Inspect application colors.
*   **Validation:**
    *   Since Continuo V1 is built around a focused, dark theme, the color scheme enforces `color-scheme: dark`. Verify that text elements do not flip to black or become invisible if system light mode is activated.

#### 4.4 Settings Card Weight
*   **Procedure:** Navigate to Settings page.
*   **Validation:**
    *   Verify there are exactly 3 cards instead of 5 separate boxes.
    *   Hierarchy feels calm and sections are grouped into "Appearance & Preferences", "About & Support", and "Danger Zone".

#### 4.5 Navigation Breadcrumbs
*   **Procedure:** Go to Settings -> click "Read Story" (About) or "Feedback & Support" or "Privacy Policy".
*   **Validation:**
    *   The back navigation header is a breadcrumb: `Back to settings / Back to New Tab`.
    *   Clicking "Back to settings" returns to the settings page.
    *   Clicking "Back to New Tab" returns directly to the main dashboard.

---

### 5. Technical Performance & Assets

#### 5.1 Font Loading
*   **Procedure:** Inspect network tab / resources on reload.
*   **Validation:**
    *   Verify Inter fonts (`Inter-Regular.woff2`, `Inter-Medium.woff2`, `Inter-SemiBold.woff2`, `Inter-Bold.woff2`) load directly from local directories.
    *   No flash of unstyled text (FOUT) or requests to Google Fonts API.

#### 5.2 Extension Permissions
*   **Procedure:** Inspect extension config `manifest.json`.
*   **Validation:**
    *   No heavy permissions requested (uses only storage/local).

#### 5.3 New Tab Performance
*   **Procedure:** Run build using `pnpm build` and measure the JS/CSS asset sizes.
*   **Validation:**
    *   Production bundle has a single compiled CSS file and single JS file.
    *   Total build size is ~300KB (gzip size ~80KB), ensuring sub-100ms loading speeds for the New Tab.
