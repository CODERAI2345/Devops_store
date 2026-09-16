import React, { useState } from "react";
import { Star, Copy, X, ExternalLink, Image as ImageIcon } from "lucide-react";

export function InstagramModal({
  item,
  onClose,
  onStar,
  onCopy,
}: {
  item: any;
  onClose: () => void;
  onStar: () => void;
  onCopy: () => void;
}) {
  const [iframeFailed, setIframeFailed] = useState(false);

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-white drop-shadow-md">Instagram</span>
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

        {/* Content Container */}
        <div className="w-full flex-1 flex justify-center bg-black/20 rounded-b-2xl overflow-hidden shadow-[inset_0_20px_60px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">
          {!iframeFailed && item.shortcode ? (
            <iframe
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
                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 w-full"
          >
            <ExternalLink className="w-4 h-4" /> Open on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
