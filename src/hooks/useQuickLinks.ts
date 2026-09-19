import { useEffect, useState, useCallback } from "react";
import { AppStorage } from "../lib/storage";
import type { FavoriteLink } from "../lib/storage";
import { checkLinksAchievements, checkAndUnlock } from "../lib/storage/achievements-helper";
import { normalizeUrl } from "../utils/quick-link-icons";

declare const chrome: any;

export function useQuickLinks() {
  const [links, setLinks] = useState<FavoriteLink[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLinks = useCallback(async () => {
    try {
      const saved = await AppStorage.getLinks();
      setLinks(saved);
    } catch (err) {
      console.error("Failed to load quick links:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  useEffect(() => {
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local" && changes.favorite_links) {
        setLinks(changes.favorite_links.newValue || []);
      }
    };

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "favorite_links") {
        setLinks(customEvent.detail.newValue || []);
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

  const addLink = useCallback(
    async (label: string, url: string): Promise<FavoriteLink | null> => {
      const cleanLabel = label.trim();
      const cleanUrl = normalizeUrl(url);

      if (!cleanLabel || !cleanUrl) return null;

      const newLink: FavoriteLink = {
        id: `link_${Date.now()}`,
        label: cleanLabel,
        url: cleanUrl,
      };

      const updated = [...links, newLink];
      setLinks(updated);
      await AppStorage.saveLinks(updated);
      await checkLinksAchievements();
      return newLink;
    },
    [links],
  );

  const updateLink = useCallback(
    async (id: string, label: string, url: string) => {
      const cleanLabel = label.trim();
      const cleanUrl = normalizeUrl(url);

      if (!cleanLabel || !cleanUrl) return;

      const updated = links.map((l) =>
        l.id === id ? { ...l, label: cleanLabel, url: cleanUrl } : l,
      );
      setLinks(updated);
      await AppStorage.saveLinks(updated);
      await checkAndUnlock("renovator");
    },
    [links],
  );

  const deleteLink = useCallback(
    async (id: string) => {
      const updated = links.filter((l) => l.id !== id);
      setLinks(updated);
      await AppStorage.saveLinks(updated);
      await checkAndUnlock("spring_cleaning");
      await checkLinksAchievements();
    },
    [links],
  );

  const reorderLinks = useCallback(async (newOrder: FavoriteLink[]) => {
    setLinks(newOrder);
    await AppStorage.saveLinks(newOrder);
    await checkAndUnlock("organizer");
  }, []);

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    refresh: loadLinks,
  };
}
