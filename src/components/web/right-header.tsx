import { Link, RotateCcwClock, SlidersHorizontal } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

export default function RightHeader() {
  const navigation = useNavigation();
  const iconClass = `
    text-text-primary
    transition-colors
    duration-200
    cursor-pointer
    hover:text-accent
    hover:bg-surface-hover
    rounded-md
    px-2 py-2
    group
  `;

  return (
    <div className="flex items-center gap-2">
      <button
        className={iconClass}
        aria-label="History"
        title="History"
        onClick={() => navigation.setView("history")}
      >
        <RotateCcwClock size={18} className="group-hover:text-text-primary" />
      </button>
      <button
        className={iconClass}
        aria-label="Link"
        title="Manage Links"
        onClick={() => navigation.setView("links")}
      >
        <Link size={18} className="group-hover:text-text-primary" />
      </button>
      <button
        className={iconClass}
        aria-label="Settings"
        title="Settings"
        onClick={() => navigation.setView("settings")}
      >
        <SlidersHorizontal
          size={18}
          className="group-hover:text-text-primary"
        />
      </button>
    </div>
  );
}
