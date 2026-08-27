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
    <div className="w-full max-w-xl mx-auto border-t border-border/20 pt-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {links.map((link) => {
          const avatarColorClass = getAvatarColor(link.label);
          const initials = getInitials(link.label);

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 w-16 text-center text-[10px] font-semibold text-text-secondary transition-colors hover:text-accent"
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-200 group-hover:scale-[1.1] group-hover:border-accent/40 group-hover:bg-surface-hover/80 shadow-md ${avatarColorClass}`}>
                {initials}
              </span>
              <span className="truncate w-full">{link.label}</span>
            </a>
          );
        })}

        <button
          type="button"
          aria-label="Add link"
          onClick={() => navigation.setView("links")}
          className="group flex flex-col items-center gap-2 w-16 text-center text-[10px] font-semibold text-text-secondary transition-colors hover:text-accent cursor-pointer"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border border-dashed text-text-secondary transition-all duration-200 group-hover:scale-[1.1] group-hover:border-accent/40 group-hover:text-text-primary group-hover:bg-surface-hover/50 shadow-md">
            <Plus size={16} strokeWidth={2.5} />
          </span>
          <span className="truncate w-full text-text-tertiary group-hover:text-text-secondary">Add Link</span>
        </button>
      </div>
    </div>
  );
}
