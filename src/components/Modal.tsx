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
import { X, Clock, Link as LinkIcon, Edit2, Save, Upload } from "lucide-react";
import { HubItem } from "../types";
import { shortenUrl, ytId, ytPlaylistId } from "../utils";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (item) {
      setEditData(item);
      setIsEditing(defaultEditing);
      
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
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    // Convert comma-separated strings back to arrays for tags/skills/topics
    const updates = { ...editData };
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

    onUpdate(item.id, updates);
    setIsEditing(false);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev: any) => ({
          ...prev,
          thumbnail: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const thumb =
    item.thumbnail ||
    ((item.type === "yt" || item.type === "ys" || item.type === "ypl") && (item as any).vid
      ? `https://img.youtube.com/vi/${(item as any).vid}/mqdefault.jpg`
      : "");
  const name = item.title || "Saved Item";
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
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
  }[item.type] || "Open Link";

  const handlePrimaryClick = async () => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div 
        className="relative w-full max-w-2xl h-full bg-[#0d1117] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 sm:max-w-[600px] xl:max-w-[700px] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Actions & Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0d1117]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/20">
                {ini}
             </div>
             {sub && <span className="text-sm font-medium text-white/60">{sub}</span>}
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              !isEditing ? (
                <button
                  className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
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
            <div className="w-px h-5 bg-white/10"></div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-0 pb-10">
          
          {/* Media Hero Section */}
          <div className="w-full relative bg-[#010409] border-b border-white/5 flex shrink-0 justify-center">
            {(item.type === "yt" || item.type === "ys" || item.type === "ypl") && (item as any).vid ? (
              <iframe
                src={`https://www.youtube.com/embed/${(item as any).vid}`}
                className={`w-full ${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto my-6 rounded-xl shadow-2xl" : "aspect-video"} border-0`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : item.type === "ypl" && (item as any).pid ? (
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${(item as any).pid}`}
                className="w-full aspect-video border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : item.type === "ig" && item.shortcode ? (
              <div className="w-full min-h-[400px] max-h-[600px] flex justify-center bg-[#010409] overflow-hidden relative">
                 <iframe
                   src={`https://www.instagram.com/p/${item.shortcode}/embed`}
                   width="100%"
                   height="100%"
                   frameBorder="0"
                   scrolling="yes"
                   allowtransparency="true"
                   allow="encrypted-media"
                   className="w-full h-full absolute inset-0 bg-white"
                 ></iframe>
              </div>
            ) : thumb ? (
              <img
                src={thumb}
                alt=""
                className={`w-full ${item.type === "ys" ? "max-w-[300px] aspect-[9/16] mx-auto object-cover my-6 rounded-xl shadow-2xl" : item.type === "li" || item.type === "lp" ? "max-h-[350px] object-contain" : "max-h-[400px] object-cover"}`}
              />
            ) : null}
          </div>

          {/* Form / Content Section */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {isEditing ? (
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    Title
                  </label>
                  <input
                    className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
                    value={editData.title || ""}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Enter a title..."
                  />
                </div>

                {(item.type === "lp" || item.type === "tw" || item.type === "ys" || item.type === "yt" || item.type === "ig" || item.type === "li") && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      {item.type === "tw" ? "Concept Tag / Topic" : "Heading"}
                    </label>
                    <input
                      className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
                      value={editData.heading || ""}
                      onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                      placeholder={item.type === "tw" ? "e.g., AI, Cloud, Career" : "Heading"}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    URL / Link
                  </label>
                  <input
                    className="w-full text-sm font-medium text-emerald-400 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                      className="flex-1 text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
                      value={editData.thumbnail || ""}
                      onChange={(e) => setEditData({ ...editData, thumbnail: e.target.value })}
                      placeholder="Image URL..."
                    />
                    <label className="cursor-pointer flex items-center justify-center w-11 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex-shrink-0 group">
                      <Upload className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    </label>
                  </div>
                </div>

                {item.type === "blog" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                      Platform
                    </label>
                    <input
                      className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                        className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                            className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                            className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                            className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
                        className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
                        value={editData.email || ""}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value, url: `mailto:${e.target.value}` })}
                        placeholder="Email"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider pl-1">
                    Description
                  </label>
                  <textarea
                    className="w-full text-sm text-white/80 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 min-h-[140px] resize-y transition-all placeholder-white/20 leading-relaxed"
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
                    className="w-full text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder-white/20"
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
              </div>
            ) : (
              <div className="flex flex-col">
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
                
                {item.description && (
                  <div className="text-sm text-white/70 leading-relaxed mb-6 whitespace-pre-wrap font-light bg-white/5 p-5 rounded-2xl border border-white/10">
                    {item.description}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {(item.type === "yt" || item.type === "ys" || item.type === "ypl") &&
                    (item as any).duration && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        {(item as any).duration}
                      </div>
                    )}
                  {(item.type === "yt" || item.type === "ys" || item.type === "ypl") &&
                    (item as any).topics &&
                    !!(item as any).topics.length && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        {(item as any).topics.join(", ")}
                      </div>
                    )}
                  {item.type === "li" &&
                    (item as any).skills &&
                    !!(item as any).skills.length && (
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        Skills: {(item as any).skills.join(", ")}
                      </div>
                    )}
                  {item.type === "lp" && (item as any).postType && (
                    <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
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
                      <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        {(item as any).location}
                      </div>
                    )}
                  {item.type === "blog" && (item as any).platform && (
                    <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      {(item as any).platform}
                    </div>
                  )}
                  {item.url && item.type !== "li" && (
                    <div 
                      className="text-xs font-medium text-white/70 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group max-w-full bg-white/5 border border-white/10 hover:bg-white/10" 
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                      <span className="truncate">{shortenUrl(item.url, 80)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/10 bg-[#0d1117]/80 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">
          {item.url ? (
            <button
              onClick={handlePrimaryClick}
              className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-white/5"
            >
              {btnLabel} <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <span className="flex-1 text-sm font-medium text-white/40 text-center py-3 bg-white/5 rounded-xl border border-white/5">
              No link attached
            </span>
          )}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${item.starred ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"}`}
              onClick={onStar}
            >
              {item.starred ? "Starred" : "Star"}
            </button>
            <button
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
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
