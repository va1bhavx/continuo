import { ChevronLeft, GitPullRequest, Sparkles, History, Wrench } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

interface ChangelogVersion {
  version: string;
  date: string;
  badge?: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: string;
    items: string[];
  }[];
}

const CHANGELOG_DATA: ChangelogVersion[] = [
  {
    version: "v1.2.0",
    date: "August 31, 2026",
    badge: "Latest Release",
    type: "minor",
    changes: [
      {
        category: "Focus Statistics Tab",
        items: [
          "Added a dedicated Statistics view with key metrics (Total Focus Time, Success Rate, Average Duration, and session splits).",
          "Implemented a custom SVG Bar Chart showing the last 7 days of focus trends directly in a clean responsive layout.",
          "Added a Circular Progress ring displaying the session completion vs stopped ratios."
        ]
      },
      {
        category: "History Filtering & Search",
        items: [
          "Introduced a text search bar to search previous focus sessions by title or accomplishment note.",
          "Added dropdown select filters for session Status (Completed vs Stopped), Timeframe (Today, Yesterday, Last 7 Days, Last 30 Days), and Duration categories."
        ]
      },
      {
        category: "Focus Timer Controls",
        items: [
          "Added Pause and Resume functionality to active focus session timers, maintaining exact elapsed time tracking across page reloads and multiple open browser tabs."
        ]
      },
      {
        category: "Custom Wallpaper URLs",
        items: [
          "Enabled setting custom backgrounds by pasting direct image URLs in Settings, keeping custom tab styling fully personalized."
        ]
      }
    ]
  },
  {
    version: "v1.1.0",
    date: "August 27, 2026",
    type: "minor",
    changes: [
      {
        category: "Quick Links Dock & Drag-n-Drop",
        items: [
          "Integrated @dnd-kit drag-and-drop reordering with a sleek vertical grip handle next to shortcuts.",
          "Redesigned the dashboard bookmarks layout into a centered circular dock to prevent cluttering.",
          "Configured new installations to start with an empty dashboard dock so users can add their own links."
        ]
      },
      {
        category: "Staggered Wallpaper Transitions",
        items: [
          "Designed a custom vertical 5-strip sweep wipe animation that runs in sequence when changing backgrounds."
        ]
      },
      {
        category: "Tactile Micro-Animations",
        items: [
          "Wired up Tailwind scale-in and slide-up animations to intention input forms, stopwatch clocks, and session summaries."
        ]
      },
      {
        category: "Visual Safety & Alerts",
        items: [
          "Added safety confirmation modal dialogs for 'Clear History' and 'Reset Preferences' settings actions.",
          "Replaced native browser alerts with clean toast notifications in the bottom-right corner."
        ]
      },
      {
        category: "Contrast & Accessibility",
        items: [
          "Improved text visibility and contrast for version dates, about descriptions, and dashboard fonts across all wallpapers."
        ]
      }
    ]
  },
  {
    version: "v1.0.0",
    date: "August 26, 2026",
    type: "major",
    changes: [
      {
        category: "Visual Polish Pass",
        items: [
          "Added glassmorphic card stylings with backdrop-blur-md and bg-surface/70 to improve text legibility over busy wallpapers.",
          "Consolidated settings layout from 5 separate boxes down to 3 cleaner cards to reduce unnecessary boxiness."
        ]
      },
      {
        category: "Navigation Improvements",
        items: [
          "Changed default back button texts from 'Back to tab' to 'Back to New Tab'.",
          "Added secondary navigation breadcrumbs (e.g. Back to settings / Back to New Tab) on nested support and legal pages."
        ]
      },
      {
        category: "Session & Form Enhancements",
        items: [
          "Integrated Form wrapper in task input field to support starting focus sessions directly via the Enter key.",
          "Added a subtle confirmation pill under session clocks showing completion status ('Session ended & saved to history').",
          "Added word-wrapping to prevent layout breaks on long intention task names and accomplishment descriptions."
        ]
      }
    ]
  },
  {
    version: "v0.1.0",
    date: "August 26, 2026",
    type: "patch",
    changes: [
      {
        category: "Initial Workspace Core",
        items: [
          "Implemented active stopwatch timer and task intention setting on primary dashboard.",
          "Created session history logging and accomplishment description inputs.",
          "Created Quick Links footer navigation shortcuts and settings interface.",
          "Added background wallpapers grid switcher and system preference toggles.",
          "Implemented fully local data storage syncing automatically across multiple open tabs."
        ]
      }
    ]
  }
];

export default function Changelog() {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto animate-fade-in text-left">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <button
          onClick={() => navigation.setView("settings")}
          className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 outline-none font-medium"
        >
          <ChevronLeft size={18} />
          <span>Back to settings</span>
        </button>
        <span className="text-text-tertiary">/</span>
        <button
          onClick={() => navigation.setView("main")}
          className="hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 outline-none font-medium"
        >
          Back to New Tab
        </button>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <GitPullRequest size={22} className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Changelog</h1>
        </div>
        <p className="text-xs text-text-secondary">Track the development and updates of Continuo.</p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-border/40 ml-3.5 pl-6 flex flex-col gap-10 mt-4 pb-4">
        {CHANGELOG_DATA.map((item) => (
          <div key={item.version} className="relative">
            {/* Timeline Dot Indicator */}
            <span className="absolute -left-[33px] top-1.5 flex items-center justify-center size-4 rounded-full bg-surface border border-border-strong/40">
              {item.type === "major" ? (
                <Sparkles size={8} className="text-accent fill-accent" />
              ) : item.type === "minor" ? (
                <History size={8} className="text-accent" />
              ) : (
                <Wrench size={8} className="text-text-secondary" />
              )}
            </span>

            {/* Version Meta */}
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-text-primary tracking-tight">{item.version}</h2>
              <span className="text-xs text-text-secondary font-medium">{item.date}</span>
              {item.badge && (
                <span className="text-[10px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full border border-accent/20">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Changes Grid */}
            <div className="flex flex-col gap-5 mt-4 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
              {item.changes.map((group, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    {group.category}
                  </h3>
                  <ul className="list-disc pl-4 flex flex-col gap-1.5 text-xs text-text-secondary leading-relaxed">
                    {group.items.map((change, cIdx) => (
                      <li key={cIdx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
