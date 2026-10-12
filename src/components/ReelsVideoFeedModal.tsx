import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Heart,
  Share2,
  ExternalLink,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Info,
  Tag,
  Flame,
  Film,
  Play,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { HubItem } from "../types";
import { ytId } from "../utils";

interface ReelsVideoFeedModalProps {
  items: HubItem[];
  initialItemId?: number | string | null;
  isOpen: boolean;
  onClose: () => void;
  onStar: (item: any) => void;
  onCopy: (item: any) => void;
  showToast: (msg: string, err?: boolean) => void;
  onSelectNormalModal?: (item: HubItem) => void;
}

type FilterCategory = "all" | "reels" | "shorts" | "yt";

export function ReelsVideoFeedModal({
  items,
  initialItemId,
  isOpen,
  onClose,
  onStar,
  onCopy,
  showToast,
  onSelectNormalModal,
}: ReelsVideoFeedModalProps) {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [heartAnim, setHeartAnim] = useState<{ id: number; x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastTapRef = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  // Filter video & reel items
  const videoItems = React.useMemo(() => {
    const supportedTypes = ["ig", "igp", "ys", "yt"];
    const allVideos = items.filter((it) => supportedTypes.includes(it.type));

    if (filter === "reels") {
      return allVideos.filter((it) => it.type === "ig" || it.type === "igp");
    }
    if (filter === "shorts") {
      return allVideos.filter((it) => it.type === "ys");
    }
    if (filter === "yt") {
      return allVideos.filter((it) => it.type === "yt");
    }
    return allVideos;
  }, [items, filter]);

  // Find initial item index
  useEffect(() => {
    if (isOpen && initialItemId) {
      const idx = videoItems.findIndex((x) => String(x.id) === String(initialItemId));
      if (idx !== -1) {
        setActiveIndex(idx);
        setTimeout(() => {
          itemRefs.current[idx]?.scrollIntoView({ behavior: "instant" });
        }, 60);
      }
    }
  }, [isOpen, initialItemId, videoItems]);

  // Only applicable on mobile version, not website/desktop
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  // Keyboard navigation (Esc to close, Up/Down to navigate, M to mute, L to like)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showInfoSheet) {
          setShowInfoSheet(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
      } else if (e.key === "l" || e.key === "L") {
        const currentItem = videoItems[activeIndex];
        if (currentItem) onStar(currentItem);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, videoItems, showInfoSheet, onClose, onStar]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= videoItems.length) return;
      setActiveIndex(index);
      setExpandedCaption(false);
      setShowInfoSheet(false);
      itemRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    },
    [videoItems.length]
  );

  // Track active item with IntersectionObserver
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveIndex(index);
              setExpandedCaption(false);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen, videoItems]);

  // Double tap to like gesture
  const handleContainerTap = (e: React.MouseEvent | React.TouchEvent, item: HubItem) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap triggered
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX = "clientX" in e ? e.clientX : (e as any).changedTouches?.[0]?.clientX || rect.width / 2;
      const clientY = "clientY" in e ? e.clientY : (e as any).changedTouches?.[0]?.clientY || rect.height / 2;
      setHeartAnim({ id: Date.now(), x: clientX - rect.left, y: clientY - rect.top });
      if (!item.starred) {
        onStar(item);
      }
      setTimeout(() => setHeartAnim(null), 1000);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Mobile swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    // If pulled down strongly when at top item or pulling modal top handle
    if (diffY > 120 && activeIndex === 0) {
      onClose();
    }
    touchStartY.current = null;
  };

  if (!isOpen) return null;
  if (typeof window !== "undefined" && window.innerWidth >= 768) return null;

  const currentItem = videoItems[activeIndex] || null;

  const allCount = items.filter((i) => ["ig", "igp", "ys", "yt"].includes(i.type)).length;
  const reelsCount = items.filter((i) => i.type === "ig" || i.type === "igp").length;
  const shortsCount = items.filter((i) => i.type === "ys").length;
  const ytCount = items.filter((i) => i.type === "yt").length;

  return (
    <div
      className="md:hidden fixed inset-0 z-[250] bg-black flex items-center justify-center overflow-hidden animate-in fade-in duration-200 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />

      {/* TOP BAR / CONTROLS - FIXED ON TOP */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-[calc(100%-120px)] sm:max-w-none">
          <button
            onClick={() => {
              setFilter("all");
              setActiveIndex(0);
              itemRefs.current[0]?.scrollIntoView({ behavior: "instant" });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              filter === "all"
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>All ({allCount})</span>
          </button>

          <button
            onClick={() => {
              setFilter("reels");
              setActiveIndex(0);
              itemRefs.current[0]?.scrollIntoView({ behavior: "instant" });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              filter === "reels"
                ? "bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 scale-105"
                : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            <span>Reels ({reelsCount})</span>
          </button>

          <button
            onClick={() => {
              setFilter("shorts");
              setActiveIndex(0);
              itemRefs.current[0]?.scrollIntoView({ behavior: "instant" });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              filter === "shorts"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Shorts ({shortsCount})</span>
          </button>

          {ytCount > 0 && (
            <button
              onClick={() => {
                setFilter("yt");
                setActiveIndex(0);
                itemRefs.current[0]?.scrollIntoView({ behavior: "instant" });
              }}
              className={`hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold transition-all items-center gap-1.5 shrink-0 ${
                filter === "yt"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>YouTube ({ytCount})</span>
            </button>
          )}
        </div>

        {/* TOP RIGHT: INDEX + PROMINENT CLOSE BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {videoItems.length > 0 && (
            <span className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 text-white/80 border border-white/15 backdrop-blur-md">
              {activeIndex + 1} / {videoItems.length}
            </span>
          )}

          {/* DEDICATED, ACCESSIBLE CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-white/20 active:bg-white/30 text-white border border-white/25 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer hover:border-white/50"
            aria-label="Close Reels Video Feed"
            title="Close Reels (Esc)"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DESKTOP PREV / NEXT BUTTONS */}
      {activeIndex > 0 && (
        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          className="hidden md:flex absolute top-1/2 -translate-y-20 left-4 lg:left-8 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Previous Video (Up Arrow)"
        >
          <ChevronUp className="w-7 h-7" />
        </button>
      )}

      {activeIndex < videoItems.length - 1 && (
        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          className="hidden md:flex absolute top-1/2 translate-y-8 left-4 lg:left-8 z-40 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Next Video (Down Arrow)"
        >
          <ChevronDown className="w-7 h-7" />
        </button>
      )}

      {/* MAIN VERTICAL SCROLL SNAP CONTAINER */}
      <div
        ref={containerRef}
        className="w-full h-[100dvh] max-w-[480px] sm:max-w-[440px] md:max-w-[460px] mx-auto overflow-y-scroll snap-y snap-mandatory bg-black relative custom-scrollbar touch-pan-y"
        style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
      >
        {videoItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/70">
            <Film className="w-16 h-16 text-pink-500/60 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No videos in this category</h3>
            <p className="text-sm text-white/50 mb-6">Switch to another filter to watch videos & reels.</p>
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-xl"
            >
              Show All Videos
            </button>
          </div>
        ) : (
          videoItems.map((item, index) => {
            const anyItem = item as any;
            const isSlideActive = index === activeIndex;
            const isInstagram = item.type === "ig" || item.type === "igp";
            const isShort = item.type === "ys";
            const isYT = item.type === "yt";
            const youtubeId = anyItem.vid || ytId(item.url || "");

            return (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                className="w-full h-[100dvh] snap-start snap-always relative flex items-center justify-center bg-black overflow-hidden"
              >
                {/* VIDEO / MEDIA CONTAINER */}
                <div
                  className="w-full h-full relative flex items-center justify-center bg-zinc-950"
                  onClick={(e) => handleContainerTap(e, item)}
                >
                  {/* YOUTUBE SHORTS / VIDEO PLAYER */}
                  {(isShort || isYT) && youtubeId ? (
                    isSlideActive ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${
                            isMuted ? 1 : 0
                          }&loop=1&playlist=${youtubeId}&controls=1&playsinline=1&rel=0&modestbranding=1`}
                          title={item.title || "YouTube Video"}
                          className="w-full h-full object-cover border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-900" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl">
                            <Play className="w-8 h-8 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : null}

                  {/* INSTAGRAM REEL / POST PLAYER */}
                  {isInstagram ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-[#070913]">
                      {item.shortcode ? (
                        <iframe
                          src={`https://www.instagram.com/p/${item.shortcode}/embed`}
                          title="Instagram Reel"
                          className="w-full h-full max-h-[82vh] border-0 bg-transparent rounded-none sm:rounded-xl"
                          allow="encrypted-media"
                        />
                      ) : item.thumbnail ? (
                        <div className="w-full h-full relative flex items-center justify-center">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/60">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-pink-500 mb-4">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                          <p className="text-white font-medium mb-3">{item.title || "Instagram Reel"}</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs"
                          >
                            Watch on Instagram
                          </a>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* DOUBLE TAP ANIMATED HEART POP */}
                  {heartAnim && (
                    <div
                      className="absolute pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 animate-[ping_0.8s_ease-out]"
                      style={{ left: heartAnim.x, top: heartAnim.y }}
                    >
                      <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                    </div>
                  )}

                  {/* SUBTLE GRADIENT OVERLAYS FOR READABILITY */}
                  <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />
                </div>

                {/* RIGHT ACTION SIDEBAR (INSTAGRAM REELS STYLE) */}
                <div className="absolute right-3.5 bottom-20 z-30 flex flex-col items-center gap-4.5 sm:gap-5">
                  {/* LIKE / STAR BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStar(item);
                    }}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                    title={item.starred ? "Starred / Liked" : "Like / Star this reel"}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-75 ${
                        item.starred
                          ? "bg-rose-500 text-white shadow-rose-500/40 scale-110"
                          : "bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md"
                      }`}
                    >
                      <Heart
                        className={`w-5.5 h-5.5 transition-transform ${item.starred ? "fill-white scale-110" : ""}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-md">
                      {item.starred ? "Liked" : "Like"}
                    </span>
                  </button>

                  {/* INFO / DETAILS SHEET BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfoSheet(true);
                    }}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                    title="View post notes & steps"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl active:scale-75 transition-all">
                      <Info className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-md">Info</span>
                  </button>

                  {/* SHARE / COPY LINK BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(item);
                    }}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                    title="Share & copy link"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl active:scale-75 transition-all">
                      <Share2 className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-md">Share</span>
                  </button>

                  {/* SOUND MUTE / UNMUTE (FOR YOUTUBE VIDEOS) */}
                  {(isShort || isYT) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                        showToast(isMuted ? "Sound Unmuted" : "Sound Muted");
                      }}
                      className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                      title={isMuted ? "Unmute sound" : "Mute sound"}
                    >
                      <div className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl active:scale-75 transition-all">
                        {isMuted ? (
                          <VolumeX className="w-5.5 h-5.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-5.5 h-5.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-white drop-shadow-md">
                        {isMuted ? "Muted" : "Sound"}
                      </span>
                    </button>
                  )}

                  {/* OPEN ORIGINAL PLATFORM LINK */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1 group/btn"
                      title={`Open on ${isInstagram ? "Instagram" : "YouTube"}`}
                    >
                      <div className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl active:scale-75 transition-all">
                        <ExternalLink className="w-5.5 h-5.5 text-pink-300" />
                      </div>
                      <span className="text-[11px] font-bold text-white drop-shadow-md">Open</span>
                    </a>
                  )}

                  {/* FULL DETAILS MODAL TOGGLE (IF USER PREFERS REGULAR MODAL) */}
                  {onSelectNormalModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onSelectNormalModal(item);
                      }}
                      className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                      title="Open standard popup modal"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 border border-white/15 backdrop-blur-md flex items-center justify-center active:scale-75 transition-all">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-medium text-white/70">Card</span>
                    </button>
                  )}
                </div>

                {/* BOTTOM INFO OVERLAY (INSTAGRAM REELS STYLE) */}
                <div className="absolute left-4 bottom-5 right-20 z-20 flex flex-col gap-2.5 text-white pointer-events-auto">
                  {/* AUTHOR / CREATOR HEADER */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0 shadow-lg">
                      <div className="w-full h-full rounded-full bg-[#121216] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                        {item.author
                          ? item.author.slice(0, 2).toUpperCase()
                          : isInstagram
                          ? "IG"
                          : "YT"}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold tracking-tight text-white drop-shadow-md truncate">
                          @{item.author || (isInstagram ? "instagram_dev" : "devops_shorts")}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400 shrink-0" />
                      </div>
                      {anyItem.heading && (
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider drop-shadow-md truncate">
                          {anyItem.heading}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-white/95 leading-snug drop-shadow-md">
                      {item.title || (isInstagram ? "Instagram Reel" : "YouTube Short")}
                    </h3>

                    {item.description &&
                      item.description !== "Embedded Instagram Content" &&
                      !item.description.includes("Join Threads") && (
                        <div className="text-xs text-white/80 leading-relaxed drop-shadow">
                          <p className={expandedCaption ? "" : "line-clamp-2"}>
                            {item.description}
                          </p>
                          {item.description.length > 80 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCaption(!expandedCaption);
                              }}
                              className="text-pink-400 hover:text-pink-300 font-bold ml-1 text-xs underline cursor-pointer"
                            >
                              {expandedCaption ? "less" : "...more"}
                            </button>
                          )}
                        </div>
                      )}
                  </div>

                  {/* TAGS PILLS */}
                  {Array.isArray(anyItem.tags) && anyItem.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {anyItem.tags.slice(0, 4).map((tag: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/10 backdrop-blur-md"
                        >
                          #{tag.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AUDIO DISC / SOUND MARQUEE */}
                  <div className="flex items-center gap-2 text-[11px] text-white/70 font-medium">
                    <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <span className="truncate max-w-[200px]">
                      🎵 Original Audio • {item.author || "DevOps Store"}
                    </span>
                  </div>
                </div>

                {/* SWIPE UP HINT ON FIRST REEL */}
                {index === 0 && (
                  <div className="absolute top-20 inset-x-0 flex justify-center pointer-events-none animate-pulse z-20">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white/80 text-[11px] font-medium border border-white/15 backdrop-blur-md">
                      Swipe up for next reel ↑
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* INFO SHEET / SLIDE-UP DRAWER */}
      {showInfoSheet && currentItem && (
        <div
          className="fixed inset-0 z-[280] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowInfoSheet(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] bg-[#0c101c] border border-white/15 rounded-t-3xl sm:rounded-2xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h4 className="text-base font-bold text-white">Reel Details & Notes</h4>
              </div>
              <button
                onClick={() => setShowInfoSheet(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              <div>
                <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Title</span>
                <p className="text-sm font-semibold text-white mt-1">{currentItem.title}</p>
              </div>

              {currentItem.author && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Author</span>
                  <p className="text-sm text-white/80 mt-1">{currentItem.author}</p>
                </div>
              )}

              {currentItem.description && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Notes / Description</span>
                  <p className="text-sm text-white/70 mt-1 whitespace-pre-wrap leading-relaxed">
                    {currentItem.description}
                  </p>
                </div>
              )}

              {Array.isArray((currentItem as any).tags) && (currentItem as any).tags.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Tags</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(currentItem as any).tags.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 font-medium"
                      >
                        #{t.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    onCopy(currentItem);
                    setShowInfoSheet(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Copy Link
                </button>

                {currentItem.url && (
                  <a
                    href={currentItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
