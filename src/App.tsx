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
      // Wait a brief moment to check customization achievements on load
      setTimeout(async () => {
        await checkCustomizationAchievements();
      }, 1000);
    };
    initWallpaper();
  }, []);

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
