import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  Copy,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Code2,
  Tv
} from "lucide-react";
import { HubItem } from "../types";
import { ThreadsMediaCarousel, extractThreadsMedia } from "./ThreadsMediaCarousel";

interface ThreadsModalProps {
  item: any;
  onClose: () => void;
  onStar: () => void;
  onCopy: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export function ThreadsModal({
  item,
  onClose,
  onStar,
  onCopy,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: ThreadsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const mediaList = React.useMemo(() => extractThreadsMedia(item), [item]);

  // Global keydown listeners for escape and post-to-post navigation if no multi-media active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onPrev && mediaList.length <= 1) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext && mediaList.length <= 1) {
        onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose, mediaList.length]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!item) return null;

  const cleanDescription = item.description &&
    item.description !== "Embedded Threads Content" &&
    !item.description.includes("Join Threads")
      ? item.description
      : "";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const diffX = touchStartX.current - e.changedTouches[0].clientX;
        const diffY = e.changedTouches[0].clientY - touchStartY.current;

        // Swipe down to dismiss on mobile
        if (diffY > 90 && Math.abs(diffX) < 80) {
          onClose();
          touchStartX.current = null;
          touchStartY.current = null;
          return;
        }

        if (diffX > 70 && onNext) onNext();
        else if (diffX < -70 && onPrev) onPrev();
        touchStartX.current = null;
        touchStartY.current = null;
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* FLOATING MOBILE CLOSE BUTTON - GUARANTEED ACCESSIBLE ON EVERY MOBILE SCREEN */}
      <button
        onClick={onClose}
        className="sm:hidden absolute top-3 right-3 z-50 w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white border border-white/25 flex items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer"
        aria-label="Close popup"
        title="Close modal"
      >
        <X className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {/* Floating Desktop Prev/Next Post Buttons */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Previous Threads Post"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Next Threads Post"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title || "Threads Post"}
        className="relative w-full max-w-[480px] max-h-[92vh] bg-[#070913] border border-white/15 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe-Down Handle */}
        <div 
          className="w-full pt-2 pb-1 flex justify-center items-center bg-white/[0.03] cursor-grab active:cursor-grabbing sm:hidden"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 rounded-full bg-white/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 shrink-0 bg-[#0f1220]/90 backdrop-blur-md z-20 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-sm text-white border border-violet-500/40 shrink-0">
              @
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md truncate max-w-[120px] sm:max-w-[170px]">
                  {item.author || "Threads"}
                </span>
                {currentIndex && totalCount ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono shrink-0">
                    {currentIndex}/{totalCount}
                  </span>
                ) : null}
              </div>
              {item.heading && (
                <span className="text-[10px] text-emerald-400 font-medium truncate max-w-[130px]">
                  {item.heading}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Prev / Next Buttons */}
            {onPrev && (
              <button
                className="sm:hidden w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 border border-white/10"
                onClick={onPrev}
                title="Previous Post"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {onNext && (
              <button
                className="sm:hidden w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 border border-white/10"
                onClick={onNext}
                title="Next Post"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {item.shortcode && (
              <button
                className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-colors border flex items-center gap-1 ${
                  showEmbed
                    ? "bg-violet-600 text-white border-violet-400"
                    : "bg-white/5 text-white/70 hover:text-white border-white/10"
                }`}
                onClick={() => setShowEmbed((v) => !v)}
                title={showEmbed ? "Switch to Media Carousel" : "Switch to Embed View"}
              >
                {showEmbed ? <Tv className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                <span>{showEmbed ? "Media" : "Embed"}</span>
              </button>
            )}

            <button
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors border ${
                item.starred
                  ? "text-amber-400 bg-amber-400/20 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/10 border-transparent bg-white/5"
              }`}
              onClick={onStar}
              title={item.starred ? "Unstar" : "Star"}
            >
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>

            <button
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors bg-white/5"
              onClick={onCopy}
              title="Copy Link"
            >
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="w-px h-5 bg-white/10 mx-0.5" />

            {/* Standard Header Close Button - Prioritized & Highly Clickable */}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all border border-white/20 cursor-pointer shrink-0"
              onClick={onClose}
              title="Close modal"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
          <div className="flex flex-col w-full">
            {/* Media Section: Horizontal Swipeable Carousel or Official Embed */}
            {showEmbed && item.shortcode ? (
              <div className="w-full min-h-[580px] h-[580px] sm:h-[620px] bg-black/40 relative flex items-center justify-center border-b border-white/10">
                <iframe
                  src={`https://www.threads.net/t/${item.shortcode}/embed`}
                  className="w-full h-full border-0"
                  allow="encrypted-media"
                  scrolling="yes"
                  title="Threads Post Embed"
                />
              </div>
            ) : (
              <div className="w-full relative bg-black/60 flex items-center justify-center border-b border-white/10 h-[420px] sm:h-[460px] overflow-hidden">
                <ThreadsMediaCarousel
                  item={item}
                  variant="modal"
                  autoPlayVideo={true}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Post Body & Details */}
            <div className="p-6 flex flex-col gap-4 bg-[#0a0c16]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs border border-white/15">
                    @
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {item.title && item.title !== "Threads Post" ? item.title : (item.author || "Threads User")}
                    </div>
                    {item.date && (
                      <div className="text-white/40 text-xs">{item.date}</div>
                    )}
                  </div>
                </div>

                {mediaList.length > 1 && (
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                    {mediaList.length} media items
                  </span>
                )}
              </div>

              {/* Text Description */}
              {cleanDescription ? (
                <p className="text-base text-white/90 whitespace-pre-wrap leading-relaxed font-light">
                  {cleanDescription}
                </p>
              ) : (
                <p className="text-sm text-white/50 italic">
                  Thread media post from @{item.author || "threads"}
                </p>
              )}

              {/* Tags */}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-[#0f1220]/90 backdrop-blur-md flex items-center gap-3 shrink-0 z-20">
          <button
            onClick={onClose}
            className="sm:hidden px-3.5 py-3 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
          >
            <X className="w-4 h-4" /> Close
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-fuchsia-500/20"
          >
            <ExternalLink className="w-4 h-4" /> Open on Threads
          </a>
        </div>
      </div>
    </div>
  );
}
