import { useEffect, useState } from "react";
import { ChevronLeft, Plus, Trash2, Globe, Pencil, Check, X, GripVertical } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";
import { AppStorage } from "../../lib/storage";
import type { FavoriteLink } from "../../lib/storage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sleek, uniform professional style for link avatars
export function getAvatarColor(_label: string) {
  return "bg-surface-hover/30 text-text-secondary border-border/60 group-hover:border-accent/40 group-hover:text-accent group-hover:bg-surface-hover/80 transition-all duration-150";
}

// Generate capital letter initials for link avatars
export function getInitials(label: string) {
  const clean = label.trim();
  if (!clean) return "?";
  const parts = clean.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).substring(0, 2).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
}

interface SortableLinkItemProps {
  link: FavoriteLink;
  index: number;
  editingLinkId: string | null;
  editLabel: string;
  setEditLabel: (val: string) => void;
  editUrl: string;
  setEditUrl: (val: string) => void;
  editError: string | null;
  handleSaveEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleStartEdit: (link: FavoriteLink) => void;
  handleDeleteLink: (id: string) => void;
}

function SortableLinkItem({
  link,
  editingLinkId,
  editLabel,
  setEditLabel,
  editUrl,
  setEditUrl,
  editError,
  handleSaveEdit,
  handleCancelEdit,
  handleStartEdit,
  handleDeleteLink,
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const avatarColorClass = getAvatarColor(link.label);
  const initials = getInitials(link.label);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between py-3.5 first:pt-0 last:pb-0 min-h-[58px] transition-colors duration-150 ${isDragging ? "bg-surface-hover/20" : ""}`}
    >
      {editingLinkId === link.id ? (
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full sm:w-1/3 h-9 px-3 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              placeholder="Label"
            />
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full sm:flex-1 h-9 px-3 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              placeholder="URL"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleSaveEdit(link.id)}
                className="p-2 rounded-md hover:bg-accent/20 hover:text-accent text-green-400 transition-all cursor-pointer bg-transparent border-0"
                title="Save changes"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-2 rounded-md hover:bg-surface-hover hover:text-text-primary text-text-secondary transition-all cursor-pointer bg-transparent border-0"
                title="Cancel editing"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          {editError && <span className="text-[10px] text-danger font-medium text-left">{editError}</span>}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Drag Handle */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="p-1 text-text-tertiary hover:text-text-primary cursor-grab active:cursor-grabbing transition-colors bg-transparent border-0 touch-none"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </button>

            {/* Dynamic Avatar */}
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${avatarColorClass}`}>
              {initials}
            </span>
            
            <div className="flex flex-col text-left min-w-0 flex-1">
              <span className="text-sm font-medium text-text-primary truncate">{link.label}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-secondary hover:text-accent transition-colors truncate max-w-full"
              >
                {link.url.replace(/^https?:\/\//i, "")}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => handleStartEdit(link)}
              className="p-1.5 rounded-md hover:bg-surface-hover hover:text-text-primary text-text-secondary transition-all cursor-pointer bg-transparent border-0"
              aria-label={`Edit ${link.label}`}
              title="Edit shortcut"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteLink(link.id)}
              className="p-1.5 rounded-md hover:bg-surface-hover hover:text-danger text-text-secondary transition-all cursor-pointer bg-transparent border-0"
              aria-label={`Delete ${link.label}`}
              title="Delete shortcut"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ManageLinks() {
  const navigation = useNavigation();

  const [links, setLinks] = useState<FavoriteLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Inline editing states
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px of drag distance to activate, allowing click events on delete/edit buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleStartEdit = (link: FavoriteLink) => {
    setEditingLinkId(link.id);
    setEditLabel(link.label);
    setEditUrl(link.url);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditLabel("");
    setEditUrl("");
    setEditError(null);
  };

  const handleSaveEdit = async (id: string) => {
    setEditError(null);
    const cleanLabel = editLabel.trim();
    let cleanUrl = editUrl.trim();

    if (!cleanLabel) {
      setEditError("Label is required.");
      return;
    }
    if (!cleanUrl) {
      setEditError("URL is required.");
      return;
    }

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch {
      setEditError("Invalid URL format.");
      return;
    }

    const updated = links.map((l) =>
      l.id === id ? { ...l, label: cleanLabel, url: cleanUrl } : l
    );
    setLinks(updated);
    await AppStorage.saveLinks(updated);

    setEditingLinkId(null);
    setEditLabel("");
    setEditUrl("");
  };

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const saved = await AppStorage.getLinks();
        setLinks(saved);
      } catch (err) {
        console.error("Failed to load links:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanLabel = label.trim();
    let cleanUrl = url.trim();

    if (!cleanLabel) {
      setError("Please enter a link label.");
      return;
    }
    if (!cleanUrl) {
      setError("Please enter a URL.");
      return;
    }

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    const newLink: FavoriteLink = {
      id: `link_${Date.now()}`,
      label: cleanLabel,
      url: cleanUrl,
    };

    const updated = [...links, newLink];
    setLinks(updated);
    await AppStorage.saveLinks(updated);

    setLabel("");
    setUrl("");
  };

  const handleDeleteLink = async (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    await AppStorage.saveLinks(updated);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const updated = arrayMove(links, oldIndex, newIndex);
    setLinks(updated);
    await AppStorage.saveLinks(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-secondary text-sm font-medium">
        Loading quick links...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto animate-fade-in text-left">
      {/* Back Button */}
      <button
        onClick={() => navigation.setView("main")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit text-sm font-medium cursor-pointer bg-transparent border-0 outline-none"
      >
        <ChevronLeft size={18} />
        <span>Back to New Tab</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Quick Links</h1>
        <p className="text-text-secondary text-sm">Add and organize your favorite shortcuts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Add Link Form */}
        <form onSubmit={handleAddLink} className="flex flex-col gap-4 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
          <h2 className="text-sm font-semibold text-text-primary">Add New Shortcut</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Label (e.g. GitHub)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex-[2]">
              <input
                type="text"
                placeholder="URL (e.g. github.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-accent text-accent-text! text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-accent-hover active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Link</span>
            </button>
          </div>
          {error && <span className="text-xs text-danger font-medium">{error}</span>}
        </form>

        {/* Existing Links List */}
        <div className="flex flex-col p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Saved Shortcuts</h2>

          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-text-secondary text-sm">
              <Globe size={32} className="opacity-20 mb-2" />
              <span>No quick links added yet.</span>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col divide-y divide-border/40">
                  {links.map((link, index) => (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      index={index}
                      editingLinkId={editingLinkId}
                      editLabel={editLabel}
                      setEditLabel={setEditLabel}
                      editUrl={editUrl}
                      setEditUrl={setEditUrl}
                      editError={editError}
                      handleSaveEdit={handleSaveEdit}
                      handleCancelEdit={handleCancelEdit}
                      handleStartEdit={handleStartEdit}
                      handleDeleteLink={handleDeleteLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
