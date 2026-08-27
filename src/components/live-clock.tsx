import { useEffect, useState } from "react";
import { AppStorage } from "../lib/storage";
import type { AppSettings } from "../lib/storage";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());
  const [settings, setSettings] = useState<AppSettings>({
    clockShowSeconds: true,
    clock24Hour: false,
    tabTitleTimer: true,
    soundAlert: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AppStorage.getSettings();
        setSettings(saved);
      } catch (err) {
        console.error("Failed to load clock settings:", err);
      }
    };
    loadSettings();
  }, []);

  // Sync settings updates in real-time
  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.app_settings) {
        setSettings(changes.app_settings.newValue);
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "app_settings") {
        setSettings(customEvent.detail.newValue);
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      window.addEventListener("local-storage-update", handleLocalUpdate);
      return () => window.removeEventListener("local-storage-update", handleLocalUpdate);
    }
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = time.toLocaleDateString(undefined, dateOptions);

  // Format time based on user settings
  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: settings.clockShowSeconds ? "2-digit" : undefined,
    hour12: !settings.clock24Hour,
  });

  return (
    <div className="text-left text-shadow-legible">
      <p className="text-3xl font-bold tracking-tight text-text-primary">{formattedTime}</p>
      <p className="text-xs text-text-secondary mt-0.5">{formattedDate}</p>
    </div>
  );
}
