declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}
import React, { useState, useEffect } from "react";
import { 
  X, 
  Clock, 
  Link as LinkIcon, 
  Edit2, 
  Save, 
  Upload, 
  Terminal, 
  Globe2,
  ExternalLink,
  Sparkles,
  Check,
  Info,
  Compass,
  ArrowRight,
  ListVideo,
  RefreshCw,
  CheckCircle2,
  PlayCircle,
  Layers,
  Bookmark,
} from "lucide-react";
import { HubItem } from "../types";
import { shortenUrl, ytId, ytPlaylistId, getPlaylistThumbnail } from "../utils";
import { ThreadsMediaCarousel, extractThreadsMedia } from "./ThreadsMediaCarousel";
import { useAuth } from "../context/AuthContext";

interface ModalProps {
  item: HubItem | null;
  isAdmin?: boolean;
  onClose: () => void;
  onStar: () => void;
  onCopy: () => void;
  onUpdate: (id: number | string, updates: Partial<HubItem>) => void;
  defaultEditing?: boolean;
}

export function Modal({
  item,
  isAdmin = false,
  onClose,
  onStar,
  onCopy,
  onUpdate,
  defaultEditing = false,
}: ModalProps) {
  const { user, isCompleted, isBookmarked, toggleProgress, toggleBookmark } = useAuth();
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [editData, setEditData] = useState<any>(() => ({ ...(item || {}) }));
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isRefreshingMeta, setIsRefreshingMeta] = useState(false);

  const completed = item ? isCompleted(item.id) : false;
  const bookmarked = item ? isBookmarked(item.id) : false;

  useEffect(() => {
    if (item) {
      setEditData({ ...item });
      setIsEditing(Boolean(defaultEditing));
      
      if (item.type === 'ig' && item.shortcode) {
        if (!window.instgrm) {
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => window.instgrm?.Embeds.process();
          document.body.appendChild(script);
        } else {
          setTimeout(() => window.instgrm?.Embeds.process(), 100);
        }
      }

    }
  }, [item, defaultEditing]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!item) return null;

  const itemType = (editData.type || item.type || "lab") as string;

  const handleSave = () => {
    // Convert comma-separated strings back to arrays for tags/skills/topics
    const updates = { ...editData };
    updates.type = updates.type || item.type || "lab";
    if (typeof updates.topics === "string")
      updates.topics = updates.topics
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    if (typeof updates.skills === "string")
      updates.skills = updates.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    if (typeof updates.tags === "string")
      updates.tags = updates.tags
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

    if (
      (item.type === "yt" || item.type === "ys" || item.type === "ypl") &&
      updates.url !== item.url
    ) {
      if (item.type === "ypl") {
        updates.pid = ytPlaylistId(updates.url) || updates.pid;
      } else {
        updates.vid = ytId(updates.url) || updates.vid;
      }
    }

    if (item.type === "th") {
      let imgList: string[] = [];
      if (typeof updates.images === "string") {
        imgList = updates.images.split("\n").map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(updates.images)) {
        imgList = updates.images.map((s: string) => typeof s === "string" ? s.trim() : "").filter(Boolean);
      }
      if (imgList.length > 0) {
        updates.images = imgList;
        updates.media = imgList.map((u: string) => ({ url: u, type: "image" as const, alt: updates.title || "Threads photo" }));
        if (!updates.thumbnail || !imgList.includes(updates.thumbnail)) {
          updates.thumbnail = imgList[0];
        }
      }
    }

    onUpdate(item.id, updates);
    setIsEditing(false);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          
          setEditData((prev: any) => ({
            ...prev,
            thumbnail: dataUrl,
          }));
        };
        img.onerror = () => {
          console.error("Failed to load image for compression");
          // Fallback to original if compression fails
          setEditData((prev: any) => ({ ...prev, thumbnail: reader.result as string }));
        };
        img.src = reader.result as string;
      };
      reader.onerror = () => {
        console.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefreshPlaylistMeta = async () => {
    if (!item || !item.url) return;
    setIsRefreshingMeta(true);
    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(item.url)}&force=true`);
      const json = await res.json();
      if (json.success && json.data) {
        const updates: any = {};
        if (json.data.title && json.data.title !== "YouTube Playlist") updates.title = json.data.title;
        if (json.data.author) updates.author = json.data.author;
        if (json.data.thumbnail) updates.thumbnail = json.data.thumbnail;
        if (json.data.pid) updates.pid = json.data.pid;
        if (json.data.vid) updates.vid = json.data.vid;
        if (json.data.count) updates.count = json.data.count;
        if (json.data.videoList) updates.videoList = json.data.videoList;
        onUpdate(item.id, updates);
        setEditData((prev: any) => ({ ...prev, ...updates }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingMeta(false);
    }
  };

  const thumb =
    item.type === "ypl"
      ? getPlaylistThumbnail(item)
      : item.thumbnail ||
        ((item.type === "yt" || item.type === "ys") && (item as any).vid
          ? `https://img.youtube.com/vi/${(item as any).vid}/mqdefault.jpg`
          : "");
  const name = String(item.title || "Saved Item");
  const sub =
    item.type === "li"
      ? [item.author, (item as any).company, (item as any).location]
          .filter(Boolean)
          .join(" - ")
      : item.type === "email"
        ? (item as any).email || ""
        : item.type === "tw"
          ? (item as any).handle || item.author || ""
          : item.author || "";
  const ini = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "LB";
  const btnLabel = {
    yt: "Watch on YouTube",
    ys: "Watch YouTube Short",
    ypl: "View Playlist",
    li: "View LinkedIn Profile",
    lp: "Open LinkedIn Post",
    blog: "Read Blog",
    email: "Send Email",
    tw: "Open X / Twitter Post",
    ig: "Open on Instagram",
    git: "View on GitHub",
    lab: "Launch Lab Environment",
    web: (item as any).platform ? `Launch ${(item as any).platform}` : "Visit Website",
  }[item.type] || "Open Link";

  const handlePrimaryClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.url) {
      try {
        const opened = window.open(item.url, "_blank", "noopener,noreferrer");
        if (!opened || opened.closed || typeof opened.closed === "undefined") {
          const a = document.createElement("a");
          a.href = item.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch {
        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 sm:max-w-[600px] xl:max-w-[700px] z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Actions & Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                {ini}
             </div>
             {sub && <span className="text-sm font-medium text-white/60">{sub}</span>}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {item && (
              <>
                <button
                  type="button"
                  onClick={() => toggleProgress(item.id, item.title, item.type)}
                  className={`text-xs font-semibold flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-full border cursor-pointer ${
                    completed
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border-white/10"
                  }`}
                  title={completed ? "Marked as completed" : "Mark as completed"}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${completed ? "text-emerald-400" : "text-white/40"}`} />
                  <span className="hidden sm:inline">{completed ? "Completed" : "Mark Complete"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBookmark(item.id, item.title, item.type)}
                  className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                    bookmarked
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : "bg-white/[0.04] text-white/60 hover:text-amber-300 hover:bg-white/[0.08] border-white/10"
                  }`}
                  title={bookmarked ? "Remove from bookmarks" : "Save to personal bookmarks"}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
                </button>
              </>
            )}

            {isAdmin && (
              !isEditing ? (
                <button
                  className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <button
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  onClick={handleSave}
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              )
            )}
            <div className="w-px h-5 bg-white/[0.05]"></div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-0 pb-10">
          
          {/* Media Hero Section */}
          <div className="w-full relative bg-[#010409] border-b border-white/10 flex shrink-0 justify-center">
            {item.type === "ypl" ? (
              <iframe
                src={`https://www.youtube.com/embed/${(item as any).vid ? `${(item as any).vid}?list=${(item as any).pid || ytPlaylistId(item.url || "") || ""}` : `videoseries?list=${(item as any).pid || ytPlaylistId(item.url || "") || ""}`}`}
                className="w-full aspect-video border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (item.type === "yt" || item.type === "ys") && (item as any).vid ? (
              <iframe
                src={`https://www.youtube.com/embed/${(item as any).vid}`}
                className={`w-full ${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto my-6 rounded-xl shadow-2xl" : "aspect-video"} border-0`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : item.type === "th" ? (
              <div className="w-full h-[420px] sm:h-[460px] flex justify-center bg-black overflow-hidden relative">
                {extractThreadsMedia(item).length > 0 ? (
                  <ThreadsMediaCarousel
                    item={item}
                    variant="modal"
                    autoPlayVideo={false}
                    className="w-full h-full"
                  />
                ) : item.shortcode ? (
                  <iframe
                    src={`https://www.threads.net/t/${item.shortcode}/embed`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="yes"
                    allow="encrypted-media"
                    className="w-full h-full absolute inset-0 bg-black/20"
                  />
                ) : (
                  <div className="flex items-center justify-center text-white/40 text-sm">
                    No media available
                  </div>
                )}
              </div>
            ) : item.type === "ig" && item.shortcode ? (
              <div className="w-full min-h-[400px] max-h-[600px] flex justify-center bg-[#010409] overflow-hidden relative">
                 <iframe
                   src={`https://www.instagram.com/p/${item.shortcode}/embed`}
                   width="100%"
                   height="100%"
                   frameBorder="0"
                   scrolling="yes"
                   allow="encrypted-media"
                   className="w-full h-full absolute inset-0 bg-black/20"
                 ></iframe>
              </div>
             ) : thumb ? (
              <img
                src={thumb}
                alt=""
                className={`w-full ${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover my-6 rounded-xl shadow-2xl" : item.type === "li" || item.type === "lp" ? "max-h-[350px] object-contain" : "max-h-[400px] object-cover"}`}
              />
            ) : item.type === "lab" ? (
              <div className="w-full py-12 flex flex-col items-center justify-center bg-gradient-to-br from-amber-950/40 via-[#0d0f17] to-black border-b border-white/10 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                  <Terminal className="w-8 h-8 text-amber-400" />
                </div>
                <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">{(item as any).platform || "Hands-on Lab"}</span>
                <span className="text-xs text-white/50 mt-1">Interactive DevOps & Cloud Challenge</span>
              </div>
            ) : item.type === "web" ? (
              <div className="w-full py-10 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950/40 via-[#0d0f17] to-black border-b border-white/10 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                  <Globe2 className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">{(item as any).platform || (item as any).domain || "Web Resource"}</span>
                <span className="text-xs text-white/50 mt-1">{(item as any).domain ? `Official Resource • ${(item as any).domain}` : "Interactive Web Platform"}</span>
              </div>
            ) : null}
          </div>

          {/* Form / Content Section */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {isEditing ? (
              <div className="flex flex-col gap-6">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Edit2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Editing {itemType === "lab" ? "Hands-on Lab" : itemType.toUpperCase()} Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    Title / Lab Name
                  </label>
                  <input
                    className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                    value={editData.title || ""}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Enter lab title..."
                  />
                </div>

                {(item.type === "lp" || item.type === "tw" || item.type === "ys" || item.type === "yt" || item.type === "ig" || item.type === "igp" || item.type === "li" || item.type === "th" || itemType === "lab") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : itemType === "lab" ? "Lab Category / Heading (e.g. Docker, Kubernetes, AWS)" : "Heading"}
                    </label>
                    <input
                      className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                      value={editData.heading || ""}
                      onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                      placeholder={item.type === "tw" ? "e.g., AI, Cloud, Career" : itemType === "lab" ? "e.g., Docker, Kubernetes, Linux, Terraform" : "Heading"}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    URL / Link
                  </label>
                  <input
                    className="w-full text-sm font-medium text-emerald-400 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                    value={editData.url || ""}
                    onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    Thumbnail (URL or Upload)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      className="flex-1 text-sm font-medium text-white/70 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                      value={editData.thumbnail || ""}
                      onChange={(e) => setEditData({ ...editData, thumbnail: e.target.value })}
                      placeholder="Image URL..."
                    />
                    <label className="cursor-pointer flex items-center justify-center w-11 h-11 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl transition-colors flex-shrink-0 group">
                      <Upload className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    </label>
                  </div>
                </div>

                {item.type === "th" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1 flex items-center justify-between">
                      <span>Carousel Photos (One image URL per line)</span>
                      {Array.isArray(editData.images) && editData.images.length > 0 && (
                        <span className="text-violet-400 font-mono text-[10px] lowercase">
                          {editData.images.length} photos
                        </span>
                      )}
                    </label>
                    <textarea
                      rows={3}
                      className="w-full text-xs font-mono text-white/80 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                      value={Array.isArray(editData.images) ? editData.images.join("\n") : (editData.images || "")}
                      onChange={(e) => setEditData({ ...editData, images: e.target.value })}
                      placeholder="https://... photo 1&#10;https://... photo 2"
                    />
                  </div>
                )}

                {item.type === "blog" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      Platform
                    </label>
                    <input
                      className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                      value={editData.platform || ""}
                      onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                      placeholder="Medium, Hashnode, etc."
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {item.type !== "email" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                        Author / Name
                      </label>
                      <input
                        className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                        value={editData.author || ""}
                        onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                        placeholder="Author"
                      />
                    </div>
                  )}
                  {(item.type === "li" || item.type === "lp" || item.type === "email" || item.type === "tw") && (
                    <>
                      {item.type !== "tw" ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                            Company
                          </label>
                          <input
                            className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                            value={editData.company || ""}
                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                            placeholder="Company"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                            Twitter Handle
                          </label>
                          <input
                            className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                            value={editData.handle || ""}
                            onChange={(e) => setEditData({ ...editData, handle: e.target.value })}
                            placeholder="@username"
                          />
                        </div>
                      )}
                      {item.type !== "email" && item.type !== "tw" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                            Location
                          </label>
                          <input
                            className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                            value={editData.location || ""}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            placeholder="Location"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {item.type === "email" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                        Email Address
                      </label>
                      <input
                        className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                        value={editData.email || ""}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value, url: `mailto:${e.target.value}` })}
                        placeholder="Email"
                      />
                    </div>
                  )}

                  {(item.type === "lab" || item.type === "web") && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                        Platform / Source
                      </label>
                      <input
                        className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                        value={editData.platform || ""}
                        onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                        placeholder="Platform (e.g. KodeKloud, AWS, Kubernetes)"
                      />
                    </div>
                  )}

                  {item.type === "lab" && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                          Difficulty Level
                        </label>
                        <select
                          className="w-full text-sm font-medium text-white/90 bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                          value={editData.difficulty || "Hands-on"}
                          onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                        >
                          <option value="Hands-on">Hands-on</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                          Duration
                        </label>
                        <input
                          className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                          value={editData.duration || ""}
                          onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                          placeholder="e.g. 45 Mins, 1-2 Hours, Self-paced"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    Description
                  </label>
                  <textarea
                    className="w-full text-sm text-white/80 bg-white/[0.03] border border-white/10 rounded-xl p-4 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] min-h-[140px] resize-y transition-all placeholder-white/20 leading-relaxed"
                    value={editData.description || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Add a detailed description..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    {item.type === "yt" || item.type === "ys" || item.type === "ypl"
                      ? "Topics"
                      : item.type === "li"
                        ? "Skills"
                        : "Tags"}{" "}
                    (comma separated)
                  </label>
                  <input
                    className="w-full text-sm font-medium text-white/90 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all placeholder-white/20"
                    value={
                      Array.isArray(
                        editData[
                          item.type === "yt" || item.type === "ys" || item.type === "ypl"
                            ? "topics"
                            : item.type === "li"
                              ? "skills"
                              : "tags"
                        ],
                      )
                        ? editData[
                            item.type === "yt" || item.type === "ys" || item.type === "ypl"
                              ? "topics"
                              : item.type === "li"
                                ? "skills"
                                : "tags"
                          ].join(", ")
                        : editData[
                            item.type === "yt" || item.type === "ys" || item.type === "ypl"
                              ? "topics"
                              : item.type === "li"
                                ? "skills"
                                : "tags"
                          ] || ""
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        [item.type === "yt" || item.type === "ys" || item.type === "ypl"
                          ? "topics"
                          : item.type === "li"
                            ? "skills"
                            : "tags"]: e.target.value,
                      })
                    }
                    placeholder="e.g. React, TypeScript, Frontend"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {isAdmin && (
                  <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Admin Mode: You can edit this item's details.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-xs text-white/40">{item.date}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug mb-5 tracking-tight break-words">
                  {(item as any).heading ? (
                    <span className="text-emerald-400 mr-3 inline-block">
                      {(item as any).heading}
                    </span>
                  ) : null}
                  {name}
                </h1>

                {item.type === "ypl" && (
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#160b20] to-black border border-red-500/20 flex flex-col gap-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          <Layers className="w-3.5 h-3.5" /> Playlist Series
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                          <ListVideo className="w-3.5 h-3.5 text-red-400" />
                          {(item as any).count ? `${(item as any).count} Lessons` : "Curated Series"}
                        </span>
                        {(item as any).author && (
                          <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-white/70 text-xs border border-white/10">
                            By {(item as any).author}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleRefreshPlaylistMeta}
                        disabled={isRefreshingMeta}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-red-500/20 text-xs font-medium text-white/80 hover:text-white border border-white/10 hover:border-red-500/40 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                        title="Re-fetch playlist metadata from YouTube"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMeta ? "animate-spin text-red-400" : ""}`} />
                        <span>{isRefreshingMeta ? "Repairing..." : "Repair / Sync Thumbnail"}</span>
                      </button>
                    </div>

                    {/* Learning Status Selector */}
                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 text-xs text-white/60 gap-2">
                      <span className="font-semibold text-white/80">Learning Progress:</span>
                      <div className="flex items-center gap-1.5">
                        {(["not_started", "in_progress", "completed"] as const).map((st) => {
                          const isCurrent = ((item as any).progressStatus || "not_started") === st;
                          const labels: Record<string, string> = {
                            not_started: "Want to Learn",
                            in_progress: "In Progress",
                            completed: "Completed",
                          };
                          const activeColors: Record<string, string> = {
                            not_started: "bg-white/20 text-white border-white/30",
                            in_progress: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                            completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                          };
                          return (
                            <button
                              key={st}
                              onClick={() => onUpdate(item.id, { progressStatus: st } as any)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                                isCurrent
                                  ? activeColors[st]
                                  : "bg-white/[0.02] text-white/40 border-white/5 hover:text-white/80 hover:bg-white/[0.05]"
                              }`}
                            >
                              {labels[st]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {item.type === "lab" && (
                  <div className="flex flex-col gap-5 mb-6">
                    {/* Platform Identity & Direct Link Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 shadow-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                          <Terminal className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>Interactive DevOps Lab</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          </div>
                          <div className="text-sm font-semibold text-white truncate">
                            {(item as any).platform || "Hands-on Practice"} • {(item as any).difficulty || "Hands-on"} • {(item as any).duration || "Self-paced"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit Lab Details
                          </button>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] shrink-0 cursor-pointer"
                          >
                            Launch Lab <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Learning Status Selector */}
                    <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-white/60 gap-2">
                      <span className="font-semibold text-white/80 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Learning Progress:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(["not_started", "in_progress", "completed"] as const).map((st) => {
                          const isCurrent = ((item as any).progressStatus || "not_started") === st;
                          const labels: Record<string, string> = {
                            not_started: "Want to Learn",
                            in_progress: "In Progress",
                            completed: "Completed",
                          };
                          const activeColors: Record<string, string> = {
                            not_started: "bg-white/20 text-white border-white/30",
                            in_progress: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                            completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                          };
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onUpdate(item.id, { progressStatus: st } as any)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                isCurrent
                                  ? activeColors[st]
                                  : "bg-white/[0.02] text-white/40 border-white/5 hover:text-white/80 hover:bg-white/[0.05]"
                              }`}
                            >
                              {labels[st]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lab Overview & Mission Card */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <Info className="w-4 h-4 text-amber-400" />
                        <span>Lab Mission & Overview</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-normal whitespace-pre-wrap">
                        {item.description ? (
                          item.description
                        ) : (
                          <>
                            <strong className="text-white font-semibold">{name}</strong> provides hands-on DevOps infrastructure practice on <strong className="text-amber-400">{(item as any).platform || "the lab platform"}</strong>. Solve configuration issues, deploy manifests, and validate cloud workloads directly in an isolated sandbox environment.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Hands-on Challenge Steps / Checklist */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                          <Check className="w-4 h-4 text-amber-400" />
                          <span>Interactive Challenge Workflow</span>
                        </div>
                        <span className="text-[11px] text-white/40">Check off as you solve</span>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        {[
                          { id: 1, text: "Launch the lab sandbox and verify CLI terminal access" },
                          { id: 2, text: "Inspect problem statement, architecture requirements, and config files" },
                          { id: 3, text: "Implement required manifests, network rules, or system configurations" },
                          { id: 4, text: "Execute tests & verification checks to ensure all assertions pass" },
                        ].map((step) => {
                          const isDone = Boolean(completedSteps[step.id]);
                          return (
                            <div
                              key={step.id}
                              onClick={() => setCompletedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                isDone 
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-white" 
                                  : "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isDone 
                                  ? "bg-emerald-500 border-emerald-400 text-black" 
                                  : "border-white/20 bg-white/5 text-transparent"
                              }`}>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <span className={`text-xs leading-relaxed ${isDone ? "line-through text-white/50" : ""}`}>
                                {step.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {item.type === "web" ? (
                  <div className="flex flex-col gap-5 mb-6">
                    {/* Platform Identity & Direct Link Header Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-blue-500/[0.08] border border-blue-500/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-inner">
                          <Globe2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span>Verified Resource</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          </div>
                          <div className="text-sm font-semibold text-white truncate">
                            {(item as any).platform || (item as any).domain || "Web Resource"}
                          </div>
                        </div>
                      </div>
                      {item.url && (
                        <button
                          onClick={handlePrimaryClick}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] shrink-0"
                        >
                          Visit Site <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* "What is this website & What does it do?" Gunshot Overview Card */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span>About this Platform</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-normal whitespace-pre-wrap">
                        {item.description || (
                          <>
                            <strong className="text-white font-semibold">{(item as any).platform || name}</strong> is an interactive web platform and curated resource for developers, engineers, and learners.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Key Highlights / Why Use It */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Key Highlights & Value</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                        <div className="flex items-start gap-2.5 text-xs text-white/80 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Direct interactive practice & real-world documentation</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-white/80 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Curated for speed, practical utility, and career growth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  item.description && (
                    <div className="text-sm text-white/70 leading-relaxed mb-6 whitespace-pre-wrap font-light bg-white/[0.03] p-5 rounded-2xl border border-white/10">
                      {item.description}
                    </div>
                  )
                )}

                <div className="flex gap-2 flex-wrap">
                  {(item.type === "yt" || item.type === "ys" || item.type === "ypl") &&
                    (item as any).duration && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        {(item as any).duration}
                      </div>
                    )}
                  {(item.type === "yt" || item.type === "ys" || item.type === "ypl") &&
                    Array.isArray((item as any).topics) &&
                    (item as any).topics.length > 0 && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                        {(item as any).topics.filter(Boolean).join(", ")}
                      </div>
                    )}
                  {item.type === "li" &&
                    Array.isArray((item as any).skills) &&
                    (item as any).skills.length > 0 && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                        Skills: {(item as any).skills.filter(Boolean).join(", ")}
                      </div>
                    )}
                  {item.type === "lp" && (item as any).postType && (
                    <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                      {(item as any).postType}
                    </div>
                  )}
                  {item.type === "tw" && (item as any).handle && (
                    <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5 bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20">
                      {(item as any).handle}
                    </div>
                  )}
                  {(item.type === "li" || item.type === "lp") &&
                    (item as any).company && (
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        @ {(item as any).company}
                      </div>
                    )}
                  {(item.type === "li" || item.type === "lp") &&
                    (item as any).location && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                        {(item as any).location}
                      </div>
                    )}
                  {item.type === "blog" && (item as any).platform && (
                    <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10">
                      {(item as any).platform}
                    </div>
                  )}
                  {item.type === "lab" && (item as any).platform && (
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                      <Terminal className="w-3.5 h-3.5" />
                      {(item as any).platform}
                    </div>
                  )}
                  {item.type === "lab" && (item as any).difficulty && (
                    <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                      {(item as any).difficulty}
                    </div>
                  )}
                  {item.type === "lab" && (item as any).duration && (
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      {(item as any).duration}
                    </div>
                  )}
                  {item.type === "web" && ((item as any).platform || (item as any).domain) && (
                    <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                      <Globe2 className="w-3.5 h-3.5" />
                      {(item as any).platform || (item as any).domain}
                    </div>
                  )}
                  {(item.type === "lab" || item.type === "web") && Array.isArray((item as any).tags) && (item as any).tags.length > 0 && (
                    (item as any).tags.filter(Boolean).map((t: any, idx: number) => (
                      <div key={`${String(t)}-${idx}`} className="text-xs font-medium text-zinc-300 flex items-center gap-1 bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/10">
                        #{String(t)}
                      </div>
                    ))
                  )}
                  {item.url && item.type !== "li" && (
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-white/70 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group max-w-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]" 
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                      <span className="truncate">{shortenUrl(item.url, 80)}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 text-center"
            >
              {btnLabel} <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          ) : (
            <span className="flex-1 text-sm font-medium text-white/40 text-center py-3 bg-white/[0.03] rounded-xl border border-white/10">
              No link attached
            </span>
          )}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${item.starred ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05]"}`}
              onClick={onStar}
            >
              {item.starred ? "Starred" : "Star"}
            </button>
            <button
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-white/70 hover:bg-white/[0.05] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              onClick={onCopy}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
