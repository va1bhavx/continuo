import { useEffect, useState } from "react";
import { ChevronLeft, Trash2, RotateCcw } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { AppSettings } from "../../lib/storage";

const WALLPAPERS = [
  {
    name: "Severina Seidl",
    path: "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp",
  },
  { name: "Karem Adem", path: "/wall/karem-adem-HDTIxZzgxI-unsplash.webp" },
  { name: "Todd Kinsey", path: "/wall/todd-kinsey-WgCjV2MglC4-unsplash.webp" },
  {
    name: "Slimane Kadi",
    path: "/wall/slimane-kadi-8-fVE4040VA-unsplash.webp",
  },
  {
    name: "Sudhakara Rao",
    path: "/wall/sudhakara-rao-RqK9eJ_YCWk-unsplash.webp",
  },

  {
    name: "Ands Mahardika",
    path: "/wall/ands-mahardika-BsElTvIfweY-unsplash.jpg",
  },
  {
    name: "Aleksa Geletey",
    path: "/wall/aleksa-geletey-hahW3n-VxoA-unsplash.jpg",
  },
  { name: "Solid Dark Color", path: "none" },
];

export default function Settings() {
  const navigation = useNavigation();

  const [settings, setSettings] = useState<AppSettings>({
    clockShowSeconds: true,
    clock24Hour: false,
    tabTitleTimer: true,
    soundAlert: true,
  });

  const [selectedWallpaper, setSelectedWallpaper] = useState<string>("");
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Toast and Modal states
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: "clear_history" | "reset_preferences";
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedSettings, savedWallpaper] = await Promise.all([
          AppStorage.getSettings(),
          AppStorage.getWallpaper(),
        ]);
        setSettings(savedSettings);
        setSelectedWallpaper(savedWallpaper);

        const isPreset = WALLPAPERS.some((w) => w.path === savedWallpaper);
        if (!isPreset && savedWallpaper !== "none") {
          setCustomWallpaperUrl(savedWallpaper);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const updateSetting = async (key: keyof AppSettings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await AppStorage.saveSettings(updated);
  };

  const handleWallpaperChange = async (path: string) => {
    setSelectedWallpaper(path);
    await AppStorage.saveWallpaper(path);
    if (path !== customWallpaperUrl) {
      setCustomWallpaperUrl("");
    }
  };

  const handleCustomWallpaperSubmit = async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setCustomWallpaperUrl(trimmed);
    setSelectedWallpaper(trimmed);
    await AppStorage.saveWallpaper(trimmed);
    showToast("Custom wallpaper applied successfully");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const triggerClearHistory = () => {
    setModal({
      type: "clear_history",
      title: "Clear Session History",
      message:
        "Are you sure you want to permanently delete all saved focus logs? This action cannot be undone.",
      action: async () => {
        await AppStorage.clearHistory();
        setModal(null);
        showToast("History cleared successfully");
      },
    });
  };

  const triggerResetSettings = () => {
    setModal({
      type: "reset_preferences",
      title: "Reset Preferences",
      message:
        "Are you sure you want to restore all settings and backgrounds to their defaults?",
      action: async () => {
        const defaults: AppSettings = {
          clockShowSeconds: true,
          clock24Hour: false,
          tabTitleTimer: true,
          soundAlert: true,
        };
        setSettings(defaults);
        await AppStorage.saveSettings(defaults);

        const defaultWall = "/wall/severina-seidl-3zSazQQX4ik-unsplash.webp";
        setSelectedWallpaper(defaultWall);
        await AppStorage.saveWallpaper(defaultWall);

        setModal(null);
        showToast("Settings reset to default");
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-medium">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto animate-fade-in text-left">
      {/* Back Header */}
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
            Settings
          </h1>
          <p className="text-text-secondary text-sm">
            Customize your dashboard and preferences.
          </p>
        </div>

        {/* Card 1: Appearance & Preferences */}
        <div className="flex flex-col gap-6 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
          {/* Wallpaper Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-md font-semibold text-text-primary">
              Background Wallpaper
            </h2>
            <p className="text-xs text-text-secondary -mt-1 font-normal">
              Select a background image or use a solid background.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
              {WALLPAPERS.map((wall) => (
                <button
                  key={wall.path}
                  onClick={() => handleWallpaperChange(wall.path)}
                  className={`relative w-full aspect-video rounded-md overflow-hidden border-2 transition-[border-color,transform] duration-150 cursor-pointer ${
                    selectedWallpaper === wall.path
                      ? "border-accent scale-[1.02] shadow-sm"
                      : "border-border hover:border-border-strong"
                  }`}
                >
                  {wall.path === "none" ? (
                    <div className="w-full h-full bg-surface-2 flex items-center justify-center text-xs text-text-secondary font-medium">
                      Solid Color
                    </div>
                  ) : (
                    <>
                      <img
                        src={wall.path}
                        alt={wall.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-medium truncate">
                          {wall.name}
                        </span>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Wallpaper Input */}
            <div className="flex flex-col gap-1.5 mt-2 animate-fade-in">
              <label className="text-[11px] font-semibold text-text-secondary">
                Or use a Custom Wallpaper URL
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCustomWallpaperSubmit(customWallpaperUrl);
                }}
                className="flex gap-2"
              >
                <input
                  type="url"
                  placeholder="Enter a custom wallpaper URL"
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-soft-border focus:shadow-[0_0_0_3px_var(--accent-soft)] transition-all"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md text-xs font-semibold bg-accent text-accent-text! hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 cursor-pointer border-0"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* Customization Options Section */}
          <div className="flex flex-col">
            <h2 className="text-md font-semibold text-text-primary mb-2">
              Preferences
            </h2>

            <ToggleSwitch
              label="Show seconds in clock"
              description="Toggle the visibility of seconds in the live clock."
              checked={settings.clockShowSeconds}
              onChange={(val) => updateSetting("clockShowSeconds", val)}
            />
            <ToggleSwitch
              label="Use 24-Hour Format"
              description="Display the time in 24-hour style instead of 12-hour AM/PM."
              checked={settings.clock24Hour}
              onChange={(val) => updateSetting("clock24Hour", val)}
            />
            <ToggleSwitch
              label="Show timer in tab title"
              description="Keep track of your active focus session ticking directly in the browser tab name."
              checked={settings.tabTitleTimer}
              onChange={(val) => updateSetting("tabTitleTimer", val)}
            />
            <ToggleSwitch
              label="Play completed alert sound"
              description="Hear a soft notification chime when your focus sessions complete or stop."
              checked={settings.soundAlert}
              onChange={(val) => updateSetting("soundAlert", val)}
            />
          </div>
        </div>

        {/* Card 2: About & Support */}
        <div className="flex flex-col gap-6 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <h2 className="text-md font-semibold text-text-primary">
                About Continuo
              </h2>
              <p className="text-xs text-text-secondary mt-0.5 font-normal">
                Read about why Continuo was built and its core philosophy.
              </p>
            </div>
            <button
              onClick={() => navigation.setView("about")}
              className="h-9 px-4 rounded-md text-xs font-semibold bg-accent text-accent-text! hover:bg-accent-hover active:scale-[0.98] transition-all duration-150 cursor-pointer border-0"
            >
              Read Story
            </button>
          </div>

          <div className="border-t border-border/40" />

          <div className="flex flex-col">
            <h2 className="text-md font-semibold text-text-primary mb-1">
              Support & Legal
            </h2>
            <p className="text-xs text-text-secondary mb-3 font-normal">
              Contact the developer or read user policies.
            </p>

            <div className="flex flex-col divide-y divide-border/40 text-sm">
              <button
                onClick={() => navigation.setView("feedback")}
                className="flex items-center justify-between py-3.5 first:pt-0 text-text-primary hover:text-accent transition-colors bg-transparent border-0 cursor-pointer w-full text-left font-medium"
              >
                <span>Feedback & Support</span>
                <span className="text-xs text-text-secondary font-medium">
                  Get Help &rarr;
                </span>
              </button>

              <button
                onClick={() => navigation.setView("changelog")}
                className="flex items-center justify-between py-3.5 text-text-primary hover:text-accent transition-colors bg-transparent border-0 cursor-pointer w-full text-left font-medium"
              >
                <span>Changelog & Release Notes</span>
                <span className="text-xs text-text-secondary font-medium">
                  View Timeline &rarr;
                </span>
              </button>

              <button
                onClick={() => navigation.setView("privacy")}
                className="flex items-center justify-between py-3.5 text-text-primary hover:text-accent transition-colors bg-transparent border-0 cursor-pointer w-full text-left font-medium"
              >
                <span>Privacy Policy</span>
                <span className="text-xs text-text-secondary font-medium">
                  Read &rarr;
                </span>
              </button>

              <button
                onClick={() => navigation.setView("terms")}
                className="flex items-center justify-between py-3.5 last:pb-0 text-text-primary hover:text-accent transition-colors bg-transparent border-0 cursor-pointer w-full text-left font-medium"
              >
                <span>Terms of Use</span>
                <span className="text-xs text-text-secondary font-medium">
                  Read &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Danger Zone */}
        <div className="flex flex-col p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-danger/30">
          <h2 className="text-md font-semibold text-danger mb-3">
            Danger Zone
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-border/40">
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-text-primary">
                Clear Session History
              </span>
              <span className="text-xs text-text-secondary mt-0.5">
                Permanently delete all saved focus logs. This cannot be undone.
              </span>
            </div>
            <button
              onClick={triggerClearHistory}
              className="h-9 px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer bg-surface-hover hover:bg-surface-2 text-danger border border-transparent"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 last:pb-0 border-0">
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-text-primary">
                Reset Preferences
              </span>
              <span className="text-xs text-text-secondary mt-0.5">
                Restore all settings and backgrounds to their defaults.
              </span>
            </div>
            <button
              onClick={triggerResetSettings}
              className="h-9 px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer bg-surface-hover hover:bg-surface-2 text-text-primary border border-transparent"
            >
              <RotateCcw size={14} />
              <span>Reset All Settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface/90 backdrop-blur-md border border-border-strong/20 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 animate-fade-in text-xs font-semibold text-text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-check animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-surface border border-border-strong/30 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <h3 className="text-md font-bold text-text-primary">
                {modal.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {modal.message}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                onClick={() => setModal(null)}
                className="h-8 px-3.5 rounded-md text-xs font-semibold bg-surface-hover hover:bg-surface-2 text-text-primary transition-all duration-150 cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                onClick={modal.action}
                className="h-8 px-3.5 rounded-md text-xs font-semibold bg-danger text-white hover:bg-danger/80 transition-all duration-150 cursor-pointer border-0"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ToggleSwitch({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/40 last:border-0">
      <div className="flex flex-col text-left pr-4">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-secondary mt-0.5">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-accent" : "bg-surface-hover"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-text-primary shadow  transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
