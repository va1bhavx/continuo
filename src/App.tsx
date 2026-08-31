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

  // Fetch initial wallpaper settings
  useEffect(() => {
    const initWallpaper = async () => {
      const saved = await AppStorage.getWallpaper();
      setWallpaper(saved);
      setBgWallpaper(saved);
    };
    initWallpaper();
  }, []);

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
    </div>
  );
}

export default App;
