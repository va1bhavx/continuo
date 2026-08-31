import { useEffect, useState } from "react";
import LiveClock from "./components/live-clock";
import AddTask from "./components/web/add-task";
import History from "./components/web/history";
import Settings from "./components/web/settings";
import ManageLinks from "./components/web/manage-links";
import AboutContinuo from "./components/web/about-continuo";
import PrivacyPolicy from "./components/web/privacy-policy";
import TermsOfUse from "./components/web/terms-of-use";
import FeedbackSupport from "./components/web/feedback-support";
import Changelog from "./components/web/changelog";
import LinksCard from "./components/web/links-card";
import RightHeader from "./components/web/right-header";
import Statistics from "./components/web/statistics";
import { useNavigation } from "./context/navigation-context";
import { AppStorage } from "./lib/storage";
import { checkCustomizationAchievements } from "./lib/storage/achievements-helper";
import TodoDrawer from "./components/web/todo-drawer";
import ScheduleDrawer from "./components/web/schedule-drawer";
import { ListTodo, CalendarClock } from "lucide-react";
import { StorageService } from "./lib/storage/chrome-storage";

function App() {
  const navigation = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [wallpaper, setWallpaper] = useState<string>(
    "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp",
  );
  const [bgWallpaper, setBgWallpaper] = useState<string>(
    "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp",
  );
  const [transitioning, setTransitioning] = useState(false);
  const [todoOpen, setTodoOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSlots, setScheduleSlots] = useState<any[]>([]);

  const loadSchedule = async () => {
    try {
      const saved = await AppStorage.getSchedule();
      const todayStr = new Date().toLocaleDateString("en-US");
      const lastDate = await StorageService.get<string>("last_notified_date", "");

      if (lastDate !== todayStr) {
        // Reset notified status for a new day
        const resetSlots = saved.map(slot => ({ ...slot, notified: false }));
        setScheduleSlots(resetSlots);
        await AppStorage.saveSchedule(resetSlots);
        await StorageService.set("last_notified_date", todayStr);
      } else {
        setScheduleSlots(saved);
      }
    } catch (e) {
      console.error("Failed to load schedule in App:", e);
    }
  };

  const [activeToast, setActiveToast] = useState<{
    message: string;
    type?: "default" | "achievement";
    achievement?: {
      title: string;
      description: string;
      icon: string;
    };
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when navigation view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigation.view]);

  // Fetch initial wallpaper settings & run initial achievement checks
  useEffect(() => {
    const initWallpaper = async () => {
      const saved = await AppStorage.getWallpaper();
      setWallpaper(saved);
      setBgWallpaper(saved);
      loadSchedule();
      // Wait a brief moment to check customization achievements on load
      setTimeout(async () => {
        await checkCustomizationAchievements();
      }, 1000);
    };
    initWallpaper();
  }, []);

  // Sync schedule list updates in real-time
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.schedule_slots) {
        loadSchedule();
      }
    };
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "schedule_slots") {
        loadSchedule();
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      window.addEventListener("schedule-update", loadSchedule);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
        window.removeEventListener("schedule-update", loadSchedule);
      };
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      window.addEventListener("schedule-update", loadSchedule);
      return () => {
        window.removeEventListener("local-storage-update", handleLocalUpdate);
        window.removeEventListener("schedule-update", loadSchedule);
      };
    }
  }, []);

  // Daily Schedule Alarm System
  useEffect(() => {
    const checkScheduleAlarms = async () => {
      if (scheduleSlots.length === 0) return;

      const now = new Date();
      const currentHrs = String(now.getHours()).padStart(2, "0");
      const currentMins = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHrs}:${currentMins}`;

      let updatedNeeded = false;
      const updatedSlots = [...scheduleSlots];

      for (let i = 0; i < updatedSlots.length; i++) {
        const slot = updatedSlots[i];
        if (slot.time === currentTimeStr && !slot.notified) {
          // Trigger notification (prioritize Chrome Extension Notifications API if available)
          if (typeof chrome !== "undefined" && chrome.notifications && chrome.notifications.create) {
            try {
              chrome.notifications.create(`schedule_${slot.id}_${Date.now()}`, {
                type: "basic",
                iconUrl: "continuo.png",
                title: `⏰ Time Table: ${slot.title}`,
                message: slot.description || "It's time for your scheduled block!",
              });
            } catch (e) {
              console.warn("Chrome notification trigger failed:", e);
            }
          } else if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              new Notification(`⏰ Time Table: ${slot.title}`, {
                body: slot.description || "It's time for your scheduled block!",
                icon: "/continuo.png",
              });
            } catch (e) {
              console.warn("Standard notification trigger failed:", e);
            }
          }
          // Mark notified
          updatedSlots[i] = { ...slot, notified: true };
          updatedNeeded = true;
        }
      }

      if (updatedNeeded) {
        setScheduleSlots(updatedSlots);
        await AppStorage.saveSchedule(updatedSlots);
      }
    };

    // Run check immediately and then every 20 seconds
    checkScheduleAlarms();
    const interval = setInterval(checkScheduleAlarms, 20000);

    return () => clearInterval(interval);
  }, [scheduleSlots]);

  // Handle global toast messages
  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveToast(customEvent.detail);
      }
    };
    window.addEventListener("app-show-toast", handleShowToast);
    return () => window.removeEventListener("app-show-toast", handleShowToast);
  }, []);

  // Auto-dismiss toast after 4.5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Sync wallpaper updates in real-time
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.current_wallpaper) {
        setWallpaper(changes.current_wallpaper.newValue);
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        customEvent.detail.key === "current_wallpaper"
      ) {
        setWallpaper(customEvent.detail.newValue);
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      return () =>
        window.removeEventListener("local-storage-update", handleLocalUpdate);
    }
  }, []);

  // Trigger wallpaper stripping transition on change
  useEffect(() => {
    if (wallpaper !== bgWallpaper) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setBgWallpaper(wallpaper);
        setTransitioning(false);
      }, 1050); // 1.05s covers all delays and transition durations
      return () => clearTimeout(timer);
    }
  }, [wallpaper, bgWallpaper]);

  return (
    <div className="min-h-screen flex flex-col w-full relative isolate">
      {/* Custom Wallpaper Transition Overlay System */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Static base wallpaper */}
        {bgWallpaper && bgWallpaper !== "none" && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.58)), url("${bgWallpaper}")`,
            }}
          />
        )}
        
        {/* Staggered Vertical Strips reveal overlay on change */}
        {transitioning && wallpaper && wallpaper !== "none" && (
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-full flex-1 bg-cover bg-center animate-strip-reveal"
                style={{
                  backgroundImage: `linear-gradient(rgba(8, 10, 12, 0.58), rgba(8, 10, 12, 0.58)), url("${wallpaper}")`,
                  backgroundPosition: `${i * 25}% center`,
                  backgroundSize: "500% 100%",
                  animationDelay: `${i * 85}ms`,
                  transform: "translateY(-100%)",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <header
        className={`flex w-full items-center justify-between px-4 py-4 shrink-0 sticky top-0 transition-all duration-200 z-50 ${
          isScrolled ? "bg-surface/95  shadow-sm" : "bg-transparent"
        }`}
      >
        <LiveClock />
        <RightHeader />
      </header>

      <main
        className={`flex flex-col items-center justify-center gap-4 relative flex-1 w-full ${
          navigation.view === "main" ? "" : "hidden"
        }`}
      >
        <AddTask />
        <LinksCard />
      </main>

      {navigation.view === "history" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <History />
        </main>
      )}

      {navigation.view === "stats" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <Statistics />
        </main>
      )}

      {navigation.view === "settings" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <Settings />
        </main>
      )}

      {navigation.view === "links" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <ManageLinks />
        </main>
      )}

      {navigation.view === "about" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <AboutContinuo />
        </main>
      )}

      {navigation.view === "privacy" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <PrivacyPolicy />
        </main>
      )}

      {navigation.view === "terms" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <TermsOfUse />
        </main>
      )}

      {navigation.view === "feedback" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <FeedbackSupport />
        </main>
      )}

      {navigation.view === "changelog" && (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 animate-fade-in">
          <Changelog />
        </main>
      )}

      <footer className="fixed bottom-4 right-4 z-40 text-[10px] text-text-secondary font-medium tracking-tight bg-surface/10 px-2 py-1 rounded backdrop-blur-xs text-shadow-legible">
        <span>Build by </span>
        <a
          href="https://kumarvaibhav.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline transition-all font-semibold"
        >
          va1bhavx
        </a>
      </footer>

      {/* Bottom-Left Quick Drawers Toolbar */}
      {navigation.view === "main" && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 bg-surface/15 backdrop-blur-xs border border-border/20 rounded-full px-2 py-1 shadow-sm text-shadow-legible transition-colors hover:bg-surface/20">
          <button
            onClick={() => setTodoOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-text-secondary hover:text-accent transition-all cursor-pointer border-0 bg-transparent"
            title="Focus Tasks"
          >
            <ListTodo size={12} />
            <span>Tasks</span>
          </button>
          <span className="h-3 w-px bg-border/30" />
          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-text-secondary hover:text-accent transition-all cursor-pointer border-0 bg-transparent"
            title="Daily Schedule"
          >
            <CalendarClock size={12} />
            <span>Schedule</span>
          </button>
        </div>
      )}

      {/* Drawers */}
      <TodoDrawer isOpen={todoOpen} onClose={() => setTodoOpen(false)} />
      <ScheduleDrawer isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />

      {/* Global Toast Notification System */}
      {activeToast && activeToast.type === "achievement" && activeToast.achievement && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-surface/90 backdrop-blur-md border border-accent/40 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] p-4 flex gap-3.5 animate-slide-up-subtle text-shadow-none text-left">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 text-3xl animate-bounce">
            {activeToast.achievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-accent mb-0.5">
              Achievement Unlocked!
            </p>
            <h4 className="text-sm font-bold text-text-primary mb-0.5 truncate">
              {activeToast.achievement.title}
            </h4>
            <p className="text-xs text-text-secondary leading-normal">
              {activeToast.achievement.description}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-text-secondary hover:text-text-primary self-start transition-colors cursor-pointer"
          >
            <span className="sr-only">Close</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {activeToast && activeToast.type !== "achievement" && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm bg-surface/90 backdrop-blur-md border border-border rounded-lg shadow-lg px-4 py-3 text-sm text-text-primary flex items-center justify-between gap-3 animate-slide-up-subtle text-shadow-none text-left">
          <span>{activeToast.message}</span>
          <button onClick={() => setActiveToast(null)} className="text-text-secondary hover:text-text-primary cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
