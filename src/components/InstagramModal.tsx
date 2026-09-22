import React, { useState, useEffect, useRef } from "react";
import { Star, Copy, X, ExternalLink, Image as ImageIcon, ChevronLeft, ChevronRight, Tag } from "lucide-react";

export function InstagramModal({
  item,
  onClose,
  onStar,
  onCopy,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
  onChangeType,
}: {
  item: any;
  onClose: () => void;
  onStar: () => void;
  onCopy: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalCount?: number;
  onChangeType?: (newType: "ig" | "igp") => void;
}) {
  const [iframeFailed, setIframeFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keyboard navigation for sliding between posts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 60 && onNext) {
      onNext(); // Swiped left -> next
    } else if (diff < -60 && onPrev) {
      onPrev(); // Swiped right -> prev
    }
    touchStartX.current = null;
  };

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Floating Desktop Prev/Next Buttons */}
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Previous Instagram Post (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Next Instagram Post (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      
      <div 
        className="relative w-full max-w-[440px] max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0 bg-white/[0.03] backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
             </div>
             <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-2">
                 <span className="text-sm font-semibold text-white drop-shadow-md truncate max-w-[190px]" title={item.title || (item.type === "igp" ? "Instagram Post" : "Instagram Reel")}>
                   {item.title && item.title !== "Instagram Post" && item.title !== "Instagram Reel" ? item.title : (item.heading ? item.heading : (item.type === "igp" ? "Instagram Post" : "Instagram Reel"))}
                 </span>
                 {onChangeType ? (
                   <select
                     value={item.type || "ig"}
                     onChange={(e) => onChangeType(e.target.value as "ig" | "igp")}
                     className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30 cursor-pointer focus:outline-none"
                     title="Switch between Instagram Reel and Instagram Post"
                   >
                     <option value="ig" className="bg-[#121216] text-white">Reel</option>
                     <option value="igp" className="bg-[#121216] text-white">Post</option>
                   </select>
                 ) : (
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 font-semibold border border-pink-500/25">
                     {item.type === "igp" ? "Post" : "Reel"}
                   </span>
                 )}
                 {currentIndex && totalCount ? (
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono shrink-0">
                     {currentIndex} / {totalCount}
                   </span>
                 ) : null}
               </div>
               {item.heading && item.title && item.title !== item.heading && (
                 <span className="text-[11px] text-pink-400 font-medium truncate max-w-[170px]">{item.heading}</span>
               )}
             </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Mobile Prev / Next Buttons */}
            {onPrev && (
              <button
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 border border-white/10"
                onClick={onPrev}
                title="Previous Post"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onNext && (
              <button
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 border border-white/10"
                onClick={onNext}
                title="Next Post"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${item.starred ? "text-amber-400 bg-amber-400/20 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.3)]" : "text-white/70 hover:text-white hover:bg-black/20/20 border-transparent bg-black/30"}`}
              onClick={onStar}
              title={item.starred ? "Unstar" : "Star"}
            >
              <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20/20 transition-colors bg-black/30"
              onClick={onCopy}
              title="Copy Link"
            >
              <Copy className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-0.5"></div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20/20 transition-colors bg-black/30"
              onClick={onClose}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags bar if item has tags */}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="px-5 py-2 bg-pink-950/20 border-b border-pink-500/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-20">
            <Tag className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            {item.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-medium whitespace-nowrap border border-pink-500/20"
              >
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        {/* Content Container */}
        <div className="w-full flex-1 flex justify-center bg-black/20 rounded-b-2xl overflow-hidden shadow-[inset_0_20px_60px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">
          {!iframeFailed && item.shortcode ? (
            <iframe
              key={item.shortcode}
              src={`https://www.instagram.com/p/${item.shortcode}/embed/captioned`}
              className="w-full min-h-[800px] h-[800px] border-0"
              allow="encrypted-media"
              scrolling="yes"
              onError={() => setIframeFailed(true)}
            ></iframe>
          ) : (
             <div className="flex flex-col w-full bg-[#121212] rounded-xl border border-white/10 overflow-hidden">
                <div className="w-full relative bg-black/50 flex items-center justify-center border-b border-white/10 h-[400px]">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="Instagram thumbnail fallback"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-white/10" />
                  )}
                </div>
                {item.description && (
                  <div className="p-5 flex flex-col gap-3 shrink-0 bg-[#121212]">
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Swipe or use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-200">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-200">→</kbd> to slide</span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
