import { getLinkedInEmbedUrl, extractTopicFromLinkedInUrl, getLabDifficultyBadge } from "../utils";
import React from "react";
import { ThreadsMediaCarousel, extractThreadsMedia } from "./ThreadsMediaCarousel";
import {
  Star,
  Copy,
  Trash2,
  ExternalLink,
  PlayCircle,
  Linkedin,
  Mail,
  FileText,
  User,
  Send,
  Github,
  Globe2,
  Instagram,
  Edit2,
  Link as LinkIcon,
  Clock,
  Terminal,
  Check,
  Code2,
} from "lucide-react";

interface CardProps {
  key?: React.Key;
  item: any;
  onStar: () => void;
  onDelete?: () => void;
  onCopy: () => void;
  onClick: () => void;
  onEnrich?: () => void;
}


export function LazyIframe({ src, title, className, ...props }: any) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Pre-load slightly before it comes into view
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className || ""}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1d2226] flex flex-col items-center justify-center gap-4 animate-pulse">
           <div className="w-12 h-12 rounded-full bg-[#38434f]"></div>
           <div className="w-3/4 h-4 rounded bg-[#38434f]"></div>
           <div className="w-1/2 h-4 rounded bg-[#38434f]"></div>
        </div>
      )}
      {isVisible && (
        <iframe
          src={src}
          title={title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  );
}

export const YTCard = React.memo(function YTCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(255,0,0,0.15)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      {/* Outer animated spark wrapper */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#ff0000_80%,#ffffff_100%)]" />
      </div>

      {/* Inner Card Layer */}
      <div className="relative m-[2px] rounded-[14px] bg-[#0a0a0a] flex flex-col overflow-hidden z-10 h-[calc(100%-4px)] transition-colors">
        <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        {item.thumbnail ? (
          <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-slate-200 hover:text-white hover:bg-black/20/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center text-slate-200 hover:text-white hover:bg-black/20/20 border border-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase mb-2">
           <PlayCircle className="w-3.5 h-3.5 text-red-500" /> YouTube
           <span>•</span>
           {item.date || "Just now"}
        </div>
        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Video"}
        </h3>
        {item.author && (
           <div className="text-xs text-white/50 mt-auto pt-3">
             {item.author}
           </div>
        )}
      </div>
      </div>
    </div>
  );
});

export const YPLCard = React.memo(function YPLCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
        {item.thumbnail ? (
          <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-slate-200 hover:text-white hover:bg-black/20/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center text-slate-200 hover:text-white hover:bg-black/20/20 border border-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase mb-2">
           <PlayCircle className="w-3.5 h-3.5 text-red-500" /> YouTube Playlist
           <span>•</span>
           {item.date || "Just now"}
        </div>
        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Playlist"}
        </h3>
        {item.author && (
           <div className="text-xs text-white/50 mt-auto pt-3">
             {item.author}
           </div>
        )}
      </div>
    </div>
  );
});

export const YSCard = React.memo(function YSCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[9/16] w-full max-h-[300px] overflow-hidden bg-white/[0.03]">
        {item.thumbnail ? (
          <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
             <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-slate-200 hover:text-white hover:bg-black/20/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white/[0.03]  flex items-center justify-center text-slate-200 hover:text-white hover:bg-black/20/20 border border-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase mb-2">
           <PlayCircle className="w-3.5 h-3.5 text-red-500" /> Shorts
           <span>•</span>
           {item.date || "Just now"}
        </div>
        {item.heading && (
          <div className="text-xs font-bold text-emerald-400 mb-1 line-clamp-1 uppercase tracking-wider">
            {item.heading}
          </div>
        )}
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title || "YouTube Short"}
        </h3>
        {item.author && (
           <div className="text-xs text-white/50 mt-auto pt-3">
             {item.author}
           </div>
        )}
      </div>
    </div>
  );
});

export const LICard = React.memo(function LICard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-[500px]"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-3 border-b border-[#38434f] flex items-center justify-between shrink-0 bg-[#1d2226]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <Linkedin className="w-5 h-5 text-[#70b5f9]" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#b2b8bd]">
              Insight
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-[#38434f] shrink-0"
                title="Open in LinkedIn"
            >
                <ExternalLink className="w-4 h-4" />
            </a>
            <button
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${item.starred ? "text-amber-400 bg-amber-400/10" : "text-[#b2b8bd] hover:bg-[#38434f]"}`}
            >
                <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-[#38434f] shrink-0"
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      {/* Profile Live Preview Layout */}
      <div className="flex-1 relative flex flex-col p-4 bg-[#1d2226]">
        <div className="flex items-start gap-3">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              {item.thumbnail ? (
                <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy"
                  src={item.thumbnail}
                  alt={item.title || "Profile avatar"}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover bg-neutral-800"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-[#b2b8bd]">
                  <Linkedin className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Profile Name & Headline */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white leading-tight truncate hover:text-[#70b5f9] hover:underline transition-colors">
                {item.title && item.title !== "LinkedIn Member" ? item.title : (item.author || "LinkedIn Professional")}
              </h3>
              
              {item.role ? (
                <p className="text-xs text-[#b2b8bd] mt-0.5 font-normal truncate">
                  {item.role}
                </p>
              ) : item.description ? (
                <p className="text-xs text-[#b2b8bd] mt-0.5 font-normal truncate">
                  {item.description.replace(/View.*profile on LinkedIn.*/i, "").trim()}
                </p>
              ) : (
                <p className="text-xs text-[#b2b8bd] italic mt-0.5 font-normal">
                  Professional Member
                </p>
              )}
              <p className="text-[11px] text-[#b2b8bd] mt-0.5">{item.date || "Recent"}</p>
            </div>
        </div>

        {/* Location & Company */}
        <div className="mt-3 flex flex-wrap gap-2">
          {item.company && (
            <span className="inline-flex items-center gap-1 text-[11px] font-normal text-[#b2b8bd]">
              🏢 {item.company}
            </span>
          )}
          {item.location && (
            <span className="inline-flex items-center gap-1 text-[11px] font-normal text-[#b2b8bd]">
              📍 {item.location}
            </span>
          )}
        </div>

        {/* About / Description */}
        {item.description && (
          <div className="mt-4 pt-4 border-t border-[#38434f]">
            <p className="text-sm text-white leading-relaxed font-normal line-clamp-6">
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

const getCategoryStyle = (heading: string) => {
  const h = (heading || "").trim().toUpperCase();
  if (h.includes("AWS")) return { bg: "bg-fuchsia-500/10 text-fuchsia-400 border-orange-500/20", label: "🔥 AWS" };
  if (h.includes("AZURE")) return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "💻 Azure" };
  if (h.includes("DEVOPS")) return { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", label: "⚙️ DevOps" };
  if (h.includes("TERRAFORM")) return { bg: "bg-gradient-to-r from-violet-500 to-fuchsia-500/10 text-violet-400 border-violet-500/20", label: "☁️ Terraform" };
  if (h.includes("LINUX")) return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "🐧 Linux" };
  if (h.includes("INTERVIEW")) return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "🎯 Interview" };
  if (h.includes("CAREER") || h.includes("HIRING") || h.includes("JOB")) return { bg: "bg-teal-500/10 text-teal-400 border-teal-500/20", label: "💼 Career" };
  if (h.includes("AI") || h.includes("ML") || h.includes("OPENAI") || h.includes("CHATGPT") || h.includes("GENAI")) return { bg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20", label: "✨ AI" };
  if (h.includes("NETWORK")) return { bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", label: "🌐 Networking" };
  return { bg: "bg-white/[0.03] text-white/60 border-white/10", label: heading || "LinkedIn Post" };
};



export const LPCard = React.memo(function LPCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  const embedUrl = getLinkedInEmbedUrl(item.url);
  const extractedTopic = extractTopicFromLinkedInUrl(item.url);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-[500px]"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-3 border-b border-[#38434f] flex items-center justify-between shrink-0 bg-[#1d2226]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <Linkedin className="w-5 h-5 text-[#70b5f9]" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            {item.heading && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[200px]">
                {item.heading}
              </span>
            )}
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "LinkedIn Post" ? item.title : (item.heading ? "" : "LinkedIn Post")}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
            <button
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${item.starred ? "text-amber-400 bg-amber-400/10" : "text-[#b2b8bd] hover:bg-[#38434f]"}`}
            >
                <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-[#38434f] shrink-0"
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#1d2226] flex flex-col">
        {embedUrl ? (
          <LazyIframe
             src={embedUrl}
             height="100%"
             width="100%"
             frameBorder="0"
             allowFullScreen
             title="Embedded post"
             className="w-full h-full absolute inset-0 bg-[#1d2226]"
             style={{ overflowY: 'auto' }}
           />
        ) : (
          <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col">
             <div className="flex items-start gap-3 mb-3">
                 <div className="w-12 h-12 rounded-full bg-[#38434f] flex items-center justify-center shrink-0">
                    <Linkedin className="w-6 h-6 text-[#b2b8bd]" />
                 </div>
                 <div className="flex flex-col">
                     <span className="text-sm font-semibold text-white hover:text-[#70b5f9] hover:underline cursor-pointer">
                        {item.title && item.title !== "LinkedIn Post" ? item.title : "LinkedIn Member"}
                     </span>
                     <span className="text-xs text-[#b2b8bd]">{extractedTopic || "LinkedIn Post"}</span>
                     <span className="text-[11px] text-[#b2b8bd] flex items-center gap-1">
                        {item.date || "Recent"} • <Globe2 className="w-3 h-3" />
                     </span>
                 </div>
             </div>

             {item.description ? (
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap font-normal mb-3">
                  {item.description}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 opacity-50 space-y-2">
                   <p className="text-xs font-normal">No text content available.</p>
                </div>
              )}

              {item.thumbnail && (
                <div className="mt-2 -mx-4 border-y border-[#38434f] bg-black">
                   <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy" src={item.thumbnail} alt="Post image" className="w-full h-auto max-h-64 object-contain" />
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
});

export const BlogCard = React.memo(function BlogCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      {item.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03] border-b border-white/10">
             <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy" src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
          </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase">
                <FileText className="w-3.5 h-3.5 text-fuchsia-400" /> Blog
                {item.platform && (
                    <>
                        <span>•</span>
                        {item.platform}
                    </>
                )}
             </div>
             
             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/[0.05] ${item.starred ? "text-amber-400" : "text-white/40 hover:text-white"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
              </button>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
        </div>

        <h3 className="text-base font-semibold text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors mb-2">
            {item.title || "Blog Post"}
        </h3>
        
        {item.description && (
            <p className="text-sm text-white/50 line-clamp-3 leading-relaxed font-light mt-auto pt-2">
                {item.description}
            </p>
        )}
      </div>
    </div>
  );
});

export const EmailCard = React.memo(function EmailCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02]  border border-white/[0.05] hover:border-violet-500/50  hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col p-5"
      onClick={onClick}
    >
        <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-purple-400/70 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                Contact • {item.date || "Just now"}
             </div>
             
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/[0.05] ${item.starred ? "text-amber-400" : "text-white/40 hover:text-white"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
              </button>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-3">
                 <h3 className="text-xl font-display font-bold text-white/95 group-hover:text-purple-300 transition-colors truncate">
                    {item.title || "Company"}
                 </h3>
                 {(item as any).role && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 ml-auto">
                      {(item as any).role}
                    </span>
                 )}
               </div>
               <div className="text-sm text-white/50 mt-2 truncate flex items-center justify-between gap-2 font-medium">
                   <div className="flex items-center gap-2">
                     <Mail className="w-4 h-4 text-purple-400/50" />
                     {(item as any).email || item.url.replace("mailto:", "")}
                   </div>
                   <button
                     className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold transition-colors opacity-0 group-hover:opacity-100"
                     onClick={(e) => {
                       e.stopPropagation();
                       window.open(item.url || `mailto:${(item as any).email}`, "_blank");
                     }}
                   >
                     Send Email <Send className="w-3 h-3" />
                   </button>
               </div>
            </div>
        </div>

        {item.description && (
            <p className="text-sm text-white/50 mt-4 line-clamp-2 leading-relaxed font-light border-t border-white/10 pt-4">
                {item.description}
            </p>
        )}
    </div>
  );
});

export const GitCard = React.memo(function GitCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  // Extract owner/repo
  let repoPath = "";
  try {
    const u = new URL(item.url);
    repoPath = u.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
  } catch (e) {
    repoPath = item.title || "";
  }

  const ogImageUrl = `https://opengraph.githubassets.com/1/${repoPath}`;

  const formatNum = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div
      className="group relative h-full overflow-hidden rounded-2xl bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(46,160,67,0.15)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      {/* Outer animated spark wrapper */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#2ea043_80%,#ffffff_100%)]" />
      </div>

      {/* Inner Card Layer */}
      <div className="relative m-[2px] rounded-[14px] bg-[#0d1117] flex flex-col overflow-hidden z-10 h-[calc(100%-4px)] transition-colors">
        <div className="flex justify-between items-center p-3 shrink-0">
         <div className="flex items-center gap-2 text-xs font-medium text-[#848d97]">
            <Github className="w-4 h-4 text-white" />
            GitHub Repository
         </div>
         
         <div className="flex items-center gap-2">
           <button
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[#21262d] ${item.starred ? "text-pink-500" : "text-[#848d97]"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#848d97] hover:bg-[#21262d] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-[150px] shrink-0 bg-[#010409] border-y border-[#30363d] relative overflow-hidden flex items-center justify-center">
         <img loading="lazy" src={ogImageUrl} alt="Repository Banner" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
      
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <h3 className="text-base font-bold text-white truncate mb-1 group-hover:text-[#2f81f7] transition-colors">
          {repoPath}
        </h3>
        
        {item.description && (
            <p className="text-sm text-[#848d97] line-clamp-2 leading-relaxed">
                {item.description}
            </p>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-[#848d97]">
           {item.language && (
             <span className="flex items-center gap-1.5">
               <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.language === 'TypeScript' ? '#3178c6' : item.language === 'JavaScript' ? '#f1e05a' : item.language === 'Python' ? '#3572A5' : item.language === 'Go' ? '#00ADD8' : '#8b5cf6' }}></span>
               <span>{item.language}</span>
             </span>
           )}
           {item.stars !== undefined && (
             <span className="flex items-center gap-1">
               <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
               {formatNum(item.stars)}
             </span>
           )}
           {item.forks !== undefined && (
             <span className="flex items-center gap-1">
               <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
               {formatNum(item.forks)}
             </span>
           )}
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center justify-between text-xs text-[#848d97] mt-4 mb-4">
           <span>Updated {item.date || 'recently'}</span>
           <span className="px-2.5 py-0.5 rounded-full border border-green-500/20 text-green-400 bg-green-500/10 font-medium">Public</span>
        </div>

        <a 
          href={item.url} 
          target="_blank" 
          rel="noreferrer" 
          className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          View Repository <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      </div>
    </div>
  );
});
export const IGCard = React.memo(function IGCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-500 flex flex-col h-[500px]"
    >
      {/* Header */}
      <div 
        className="p-3 border-b border-[#38434f] flex items-center justify-between shrink-0 bg-[#1d2226] cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center shrink-0">
            <Instagram className="w-5 h-5 text-pink-400" />
          </div>
          <div className="flex flex-col">
            {item.heading && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[200px]">
                {item.heading}
              </span>
            )}
            <span className="text-sm font-semibold text-white max-w-[200px] truncate">
              {item.title && item.title !== "Instagram Post" && item.title !== "Instagram Reel" ? item.title : (item.heading ? "" : item.type === "igp" ? "Instagram Post" : "Instagram Reel")}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
            <button
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${item.starred ? "text-amber-400 bg-amber-400/10" : "text-[#b2b8bd] hover:bg-[#38434f]"}`}
            >
                <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-[#38434f] shrink-0"
            >
                <Copy className="w-4 h-4" />
            </button>
 
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {item.shortcode ? (
            <LazyIframe
              src={`https://www.instagram.com/p/${item.shortcode}/embed`}
              title="Instagram embed"
              className="w-full h-full absolute inset-0 bg-black/20"
              allow="encrypted-media"
            />
         ) : (
            <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col" onClick={onClick}>
               {item.thumbnail && item.thumbnail !== "" ? (
                 <img onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/666666?text=Not+Found'; }}  loading="lazy" src={item.thumbnail} alt="Instagram content" className="w-full h-auto rounded-lg mb-4 object-contain max-h-[250px] bg-white/[0.03] border border-white/10" />
               ) : null}
               <div className="text-white text-sm whitespace-pre-wrap leading-relaxed cursor-pointer">
                  {item.description && item.description !== "Embedded Instagram Content" && !item.description.includes("Join Threads") ? item.description : "View on Instagram"}
               </div>
               <a href={item.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mt-4 inline-flex items-center justify-center bg-white/[0.05] hover:bg-black/20/20 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full w-max">
                  Open on Instagram
               </a>
            </div>
         )}
      </div>
    </div>
  );
});

export const THCard = React.memo(function THCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  const mediaList = React.useMemo(() => extractThreadsMedia(item), [item]);
  const [showEmbed, setShowEmbed] = React.useState(false);

  const cleanDescription = React.useMemo(() => {
    if (!item.description) return "";
    if (item.description === "Embedded Threads Content" || item.description.includes("Join Threads")) return "";
    return item.description;
  }, [item.description]);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-[520px] shadow-xl"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#121524]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 text-white font-bold text-xs">
            @
          </div>
          <div className="flex flex-col min-w-0">
            {item.heading && (
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate max-w-[180px]">
                {item.heading}
              </span>
            )}
            <span className="text-sm font-semibold text-white truncate max-w-[180px]">
              {item.title && item.title !== "Threads Post" ? item.title : (item.author || "Threads Post")}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1.5 items-center shrink-0">
          {item.shortcode && mediaList.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowEmbed((v) => !v); }}
              className="px-2 py-1 rounded text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
              title={showEmbed ? "Switch to swipeable media carousel" : "Switch to embed view"}
            >
              {showEmbed ? "Media" : "Embed"}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onStar(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${item.starred ? "text-amber-400 bg-amber-400/10" : "text-[#b2b8bd] hover:bg-white/10"}`}
            title={item.starred ? "Unstar" : "Star"}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-white/10 shrink-0"
            title="Copy Link"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Media or Embed Area */}
      <div className="flex-1 relative bg-[#07090e] flex flex-col min-h-0 overflow-hidden">
        {showEmbed && item.shortcode ? (
          <div className="w-full h-full relative">
            <LazyIframe
              src={`https://www.threads.net/t/${item.shortcode}/embed`}
              title="Threads embed"
              className="w-full h-full absolute inset-0 bg-black/20"
            />
          </div>
        ) : mediaList.length > 0 ? (
          <div className="flex-1 min-h-0 relative">
            <ThreadsMediaCarousel
              item={item}
              variant="card"
              onMediaClick={() => onClick()}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-3">
              @
            </div>
            <p className="text-white/80 text-sm italic line-clamp-4 leading-relaxed font-light">
              "{cleanDescription || "View post on Threads"}"
            </p>
          </div>
        )}

        {/* Caption snippet if media is shown */}
        {cleanDescription && mediaList.length > 0 && (
          <div className="p-3 bg-[#0c0e17] border-t border-white/10 shrink-0">
            <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
              {cleanDescription}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-3 py-2 border-t border-white/10 bg-[#121524] flex items-center justify-between shrink-0 text-xs">
        <span className="text-white/40 text-[11px] truncate max-w-[150px]">
          {item.date || "Threads"}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          Open <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
});



export const WebCard = React.memo(function WebCard({ item, onStar, onDelete, onClick }: CardProps) {
  let domain = "website.com";
  try {
    domain = new URL(item.url).hostname.replace(/^www\./i, "");
  } catch(e) {}
  
  const favicon = item.favicon || `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=128`;
  const platform = (item as any).platform || domain;
  const tags: string[] = Array.isArray((item as any).tags) ? (item as any).tags : [];

  const colorSchemes = [
    { 
      banner: "bg-teal-600", 
      cardBg: "bg-[#041111]", 
      border: "border-teal-900/40", 
      wrapperBg: "bg-teal-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(13,148,136,0.2)]",
      tagBg: "bg-teal-500/10", 
      tagText: "text-teal-400", 
      tagBorder: "border-teal-500/20",
      link: "text-teal-400",
      buttonBg: "bg-[#041111]/80 hover:bg-teal-500/30",
    },
    { 
      banner: "bg-indigo-600", 
      cardBg: "bg-[#090916]", 
      border: "border-indigo-900/40", 
      wrapperBg: "bg-indigo-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(79,70,229,0.2)]", 
      tagBg: "bg-indigo-500/10", 
      tagText: "text-indigo-400", 
      tagBorder: "border-indigo-500/20",
      link: "text-indigo-400",
      buttonBg: "bg-[#090916]/80 hover:bg-indigo-500/30",
    },
    { 
      banner: "bg-rose-600", 
      cardBg: "bg-[#160408]", 
      border: "border-rose-900/40", 
      wrapperBg: "bg-rose-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(225,29,72,0.2)]", 
      tagBg: "bg-rose-500/10", 
      tagText: "text-rose-400", 
      tagBorder: "border-rose-500/20",
      link: "text-rose-400",
      buttonBg: "bg-[#160408]/80 hover:bg-rose-500/30",
    },
    { 
      banner: "bg-amber-600", 
      cardBg: "bg-[#160f04]", 
      border: "border-amber-900/40", 
      wrapperBg: "bg-amber-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(217,119,6,0.2)]", 
      tagBg: "bg-amber-500/10", 
      tagText: "text-amber-400", 
      tagBorder: "border-amber-500/20",
      link: "text-amber-400",
      buttonBg: "bg-[#160f04]/80 hover:bg-amber-500/30",
    },
    { 
      banner: "bg-blue-700", 
      cardBg: "bg-[#040b16]", 
      border: "border-blue-900/40", 
      wrapperBg: "bg-blue-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(29,78,216,0.2)]", 
      tagBg: "bg-blue-500/10", 
      tagText: "text-blue-400", 
      tagBorder: "border-blue-500/20",
      link: "text-blue-400",
      buttonBg: "bg-[#040b16]/80 hover:bg-blue-500/30",
    },
    { 
      banner: "bg-emerald-600", 
      cardBg: "bg-[#04140a]", 
      border: "border-emerald-900/40", 
      wrapperBg: "bg-emerald-900/20",
      hoverShadow: "hover:shadow-[0_8px_30px_rgba(5,150,105,0.2)]", 
      tagBg: "bg-emerald-500/10", 
      tagText: "text-emerald-400", 
      tagBorder: "border-emerald-500/20",
      link: "text-emerald-400",
      buttonBg: "bg-[#04140a]/80 hover:bg-emerald-500/30",
    }
  ];

  const colorIndex = Array.from(domain).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorSchemes.length;
  const theme = colorSchemes[colorIndex];

  return (
    <div 
      key={item.id}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl ${theme.wrapperBg} ${theme.hoverShadow} hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      {/* Outer animated spark wrapper (shows through the 1.5px inner margin) */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#f4a460_80%,#ffffff_100%)]" />
      </div>

      {/* Inner Card Layer */}
      <div className={`relative m-[2px] rounded-[14px] ${theme.cardBg} flex flex-col justify-between overflow-hidden z-10 h-[calc(100%-4px)]`}>
        {/* Top action buttons (Only Star & Delete) */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStar();
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${item.starred ? "bg-white text-amber-500 shadow-md" : `${theme.buttonBg} text-white/70 shadow-sm border border-white/10`}`}
          title="Star website"
        >
          <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
        </button>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`w-7 h-7 rounded-full ${theme.buttonBg} text-white/70 hover:text-rose-400 shadow-sm border border-white/10 flex items-center justify-center transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100`}
            title="Delete website"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top Banner (Solid Color + Logo) */}
      <div className={`w-full h-36 ${theme.banner} relative flex flex-col items-center justify-center p-4`}>
        {item.thumbnail && (
          <img 
            src={item.thumbnail} 
            alt={item.title || "Website preview"} 
            className="w-full h-full absolute inset-0 object-cover pointer-events-none"
          />
        )}
        
        {!item.thumbnail && (
          <div className="flex flex-col items-center gap-3 z-10">
            <img 
              loading="lazy" 
              src={favicon} 
              alt={domain} 
              className="w-12 h-12 rounded-xl object-contain bg-white/20 p-2 backdrop-blur-md shadow-lg" 
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                const next = e.currentTarget.nextElementSibling;
                if (next) next.classList.remove('hidden'); 
              }} 
            />
            <Globe2 className="w-8 h-8 text-white/80 hidden drop-shadow-md" />
            
            <h3 className="font-bold text-white text-xl tracking-wide drop-shadow-md text-center line-clamp-1 px-4">
              {platform}
            </h3>
          </div>
        )}
      </div>

      {/* Body description & tags */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-1 mb-1.5 group-hover:text-white/90 transition-colors">
            {item.title || domain}
          </h3>
          <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {item.description || "Curated documentation, architecture reference, or tool for your cloud & DevOps journey."}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <LinkIcon className={`w-3.5 h-3.5 ${theme.link}`} />
            <span className={`${theme.link} truncate`}>{domain}</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5 mt-1">
              {tags.slice(0, 4).map((t: string) => (
                <span key={t} className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.tagBg} ${theme.tagText} border ${theme.tagBorder} rounded-md`}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
});

export const LabCard = React.memo(function LabCard({ item, onStar, onDelete, onClick }: CardProps) {
  let platformName = (item as any).platform || "";
  if (!platformName) {
    try {
      const host = new URL(item.url).hostname.replace(/^www\./i, '');
      const first = host.split('.')[0];
      platformName = first.charAt(0).toUpperCase() + first.slice(1);
    } catch(e) {
      platformName = "Hands-on Lab";
    }
  }

  const tags: string[] = Array.isArray((item as any).tags) ? (item as any).tags : [];
  const duration = (item as any).duration || "Self-paced";
  const difficulty = ((item as any).difficulty || "Hands-on").toLowerCase();
  
  let difficultyClass = "text-blue-700 bg-blue-100 border-blue-200";
  let difficultyLabel = "Hands-on";
  if (difficulty.includes("beginner") || difficulty.includes("intro") || difficulty.includes("easy")) {
    difficultyClass = "text-emerald-700 bg-emerald-100 border-emerald-200";
    difficultyLabel = "Beginner";
  } else if (difficulty.includes("intermediate") || difficulty.includes("medium")) {
    difficultyClass = "text-amber-700 bg-amber-100 border-amber-200";
    difficultyLabel = "Intermediate";
  } else if (difficulty.includes("advanced") || difficulty.includes("hard") || difficulty.includes("expert")) {
    difficultyClass = "text-rose-700 bg-rose-100 border-rose-200";
    difficultyLabel = "Advanced";
  }

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      key={item.id}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-amber-200/70 hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)] hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      {/* Outer animated spark wrapper (shows through the 2px inner margin) */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[-100%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#ff00ff_80%,#ffffff_100%)]" />
      </div>

      {/* Inner Card Layer */}
      <div className={`relative m-[2px] rounded-[14px] bg-amber-50/95 flex flex-col justify-between overflow-hidden z-10 h-[calc(100%-4px)]`}>
        {/* Top action buttons (Only Star & Delete) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStar();
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${item.starred ? "bg-amber-500 text-white shadow-md border border-amber-600" : "bg-white/90 text-amber-300 hover:text-amber-600 hover:bg-white shadow-sm border border-amber-100"}`}
          title="Star Lab"
        >
          <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
        </button>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm border border-amber-100 flex items-center justify-center transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
            title="Delete Lab"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Visual Cover / Terminal Preview Banner */}
      <div className="w-full aspect-video bg-gradient-to-br from-amber-100 to-orange-50 relative border-b border-amber-200/70 flex items-center justify-center overflow-hidden">
        {item.thumbnail ? (
          <img 
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
              const placeholder = e.currentTarget.parentElement?.querySelector('.lab-cover-fallback') as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}  
            loading="lazy" 
            src={item.thumbnail} 
            alt={item.title || "Lab thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
          />
        ) : null}

        <div className={`lab-cover-fallback absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${item.thumbnail ? 'hidden' : 'flex'}`}>
          <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <Terminal className="w-7 h-7 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-amber-900 tracking-wide uppercase">{platformName}</span>
          <span className="text-[11px] text-amber-700/70 mt-1">Interactive Hands-on Lab</span>
        </div>

        {/* Floating difficulty badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${difficultyClass}`}>
            {difficultyLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/90 border border-amber-200 text-amber-900 shadow-sm backdrop-blur-sm">
            {platformName}
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-transparent">
        <div>
          <h3 className="font-extrabold text-amber-950 text-lg leading-tight line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
            {item.title || "Interactive Lab Course"}
          </h3>
          <p className="text-sm text-amber-900/70 line-clamp-2 leading-relaxed mb-4">
            {item.description || "Hands-on cloud & DevOps laboratory scenario with live environments, step-by-step challenges, and verification tests."}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t: string) => (
                <span key={t} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/60 text-amber-800 border border-amber-200/70 rounded-md">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold text-amber-900/60 pt-4 border-t border-amber-200/60 mt-1">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 group-hover:text-amber-800 transition-colors font-bold">
              <Terminal className="w-4 h-4" />
              Start Lab <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
});

export { TWCard } from './TWCard';
