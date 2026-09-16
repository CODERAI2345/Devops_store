import React, { useEffect, useRef, useState } from "react";
import { Star, Copy, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import { HubItem } from "../types";

interface ThreadsModalProps {
  item: HubItem;
  onClose: () => void;
  onStar: () => void;
  onCopy: () => void;
}

export function ThreadsModal({ item, onClose, onStar, onCopy }: ThreadsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-[420px] max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Matching Instagram Modal) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white border border-white/20">
                @
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-white drop-shadow-md">Threads</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
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
            <div className="w-px h-5 bg-black/20/20 mx-1"></div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20/20 transition-colors bg-black/30"
              onClick={onClose}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container (Matching Instagram Fallback layout) */}
        <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-transparent"><div className="flex flex-col w-full">
             <div className="w-full relative bg-black/50 flex items-center justify-center border-b border-white/10 min-h-[400px]">
               {item.thumbnail ? (
                 <img
                   src={item.thumbnail}
                   alt="Threads thumbnail"
                   className="w-full h-full object-contain"
                 />
               ) : (
                 <ImageIcon className="w-12 h-12 text-white/10" />
               )}
             </div>

             {/* Scrollable Text Area */}
             <div className="p-8 flex flex-col gap-4 bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center font-bold text-white text-xs">@</div>
                  <div className="text-white font-bold text-sm">{item.title || "Threads User"}</div>
                </div>
                <p className="text-base text-white/80 whitespace-pre-wrap leading-relaxed font-light">
                  {item.description && item.description !== "Embedded Threads Content" && !item.description.includes("Join Threads") 
                     ? item.description 
                     : "View thread on Threads.net"}
                </p>
             </div>
          </div>
        </div>

        {/* Footer (Matching Instagram Modal) */}
        <div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 w-full"
          >
            <ExternalLink className="w-4 h-4" /> Open on Threads
          </a>
        </div>
      </div>
    </div>
  );
}
