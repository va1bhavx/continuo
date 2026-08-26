import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { FavoriteLink } from "../../lib/storage";
import { getAvatarColor, getInitials } from "./manage-links";

export default function LinksCard() {
  const navigation = useNavigation();
  const [links, setLinks] = useState<FavoriteLink[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const saved = await AppStorage.getLinks();
        setLinks(saved);
      } catch (err) {
        console.error("Failed to load quick links:", err);
      }
    };
    loadLinks();
  }, []);

  // Sync quick links updates in real-time
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

  return (
    <div className="w-full max-w-lg mx-auto border-t border-border/40 pt-4 mt-2">
      <div className="flex items-center gap-4 flex-wrap">
        {links.map((link) => {
          const avatarColorClass = getAvatarColor(link.label);
          const initials = getInitials(link.label);

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-semibold text-text-primary transition-colors hover:text-accent"
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-150 group-hover:scale-[1.05] ${avatarColorClass}`}>
                {initials}
              </span>
              <span className="truncate max-w-[80px]">{link.label}</span>
            </a>
          );
        })}

        <button
          type="button"
          aria-label="Add link"
          onClick={() => navigation.setView("links")}
          className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:bg-surface-hover hover:text-text-primary cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
