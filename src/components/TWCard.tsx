import React from "react";
import { Star, Copy, ExternalLink, Twitter, Maximize2, ArrowUpRight } from "lucide-react";
import { extractTwitterUsername, shortenUrl, getTwitterEmbedUrl } from "../utils";

export function TWCard({ item, onStar, onCopy, onClick, showToast }: any) {
  const embedUrl = getTwitterEmbedUrl(item.url);
  const handle = item.handle || extractTwitterUsername(item.url) || "@TwitterUser";

  return (
    <div
      className="group h-[500px] relative rounded-xl bg-[#2f3336] hover:shadow-[0_8px_30px_rgba(29,155,240,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Outer animated spark wrapper (shows through the 2px inner margin) */}
      <div className="absolute inset-0 overflow-hidden rounded-xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#1d9bf0_80%,#ffffff_100%)]" />
      </div>

      {/* Inner Card Layer */}
      <div className="relative m-[2px] rounded-[10px] bg-black hover:bg-[#080808] flex flex-col overflow-hidden z-10 h-[calc(100%-4px)] transition-colors">
        {/* Header */}
      <div className="p-3 flex items-center justify-between shrink-0 bg-black">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <Twitter className="w-5 h-5 text-[#e7e9ea]" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#e7e9ea]">
              Post
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[#181818] shrink-0 ${
              item.starred ? "text-amber-400" : "text-[#71767b]"
            }`}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#71767b] hover:bg-[#181818] hover:text-[#1d9bf0] shrink-0"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embed or Fallback */}
      <div className="flex-1 relative bg-black flex flex-col">
        {embedUrl ? (
          <iframe
             src={embedUrl}
             height="100%"
             width="100%"
             frameBorder="0"
             allowFullScreen
             title="Embedded post"
             className="w-full h-full absolute inset-0 bg-black"
             style={{ overflowY: "auto" }}
           />
        ) : (
          <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-start gap-3 mb-2">
               <div className="w-10 h-10 rounded-full bg-[#16181c] flex items-center justify-center shrink-0">
                 <Twitter className="w-5 h-5 text-[#71767b]" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[15px] font-bold text-[#e7e9ea] hover:underline cursor-pointer">
                   {item.title || "X User"}
                 </span>
                 <span className="text-[15px] text-[#71767b]">{handle}</span>
               </div>
            </div>
            
            {item.description ? (
              <p className="text-[15px] text-[#e7e9ea] leading-normal whitespace-pre-wrap font-normal mb-3">
                {item.description}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 opacity-50 space-y-2">
                 <p className="text-[15px] text-[#71767b] font-normal">No text content available.</p>
              </div>
            )}
            
            <div className="text-[15px] text-[#71767b] hover:underline cursor-pointer mt-auto pt-2 border-t border-[#2f3336]">
               {item.date || "Just now"}
            </div>
          </div>
        )}
      </div>

      {/* Clickable footer affordance */}
      <div 
        onClick={onClick}
        className="p-2.5 px-3 bg-[#16181c] border-t border-[#2f3336] flex items-center justify-between text-xs text-[#1d9bf0] hover:bg-[#1d2226] transition-colors cursor-pointer shrink-0 z-20"
      >
        <span className="flex items-center gap-1.5 font-semibold text-white/90">
          <Maximize2 className="w-3.5 h-3.5 text-[#1d9bf0]" /> Pop up to see full post & notes
        </span>
        <span className="text-[11px] text-[#1d9bf0] flex items-center gap-0.5">
          Expand <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
      </div>
    </div>
  );
}
