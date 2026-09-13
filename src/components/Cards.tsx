import { getLinkedInEmbedUrl, extractTopicFromLinkedInUrl } from "../utils";
import React from "react";
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
  Github, Globe2
, Instagram, Edit2} from "lucide-react";

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

export function YTCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {item.thumbnail ? (
          <img loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-white/70 hover:text-white hover:bg-white/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 border border-white/10 transition-colors"
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
  );
}

export function YPLCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {item.thumbnail ? (
          <img loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-white/70 hover:text-white hover:bg-white/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 border border-white/10 transition-colors"
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
}

export function YSCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[9/16] w-full max-h-[300px] overflow-hidden bg-black/40">
        {item.thumbnail ? (
          <img loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
             <PlayCircle className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Top actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-white/70 hover:text-white hover:bg-white/20"}`}
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 border border-white/10 transition-colors"
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
}

export function LICard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group h-[500px] flex flex-col relative overflow-hidden rounded-xl bg-[#1d2226] border border-[#38434f] hover:border-[#4b5563] transition-all cursor-pointer"
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
                <img loading="lazy"
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
}

const getCategoryStyle = (heading: string) => {
  const h = (heading || "").trim().toUpperCase();
  if (h.includes("AWS")) return { bg: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "🔥 AWS" };
  if (h.includes("AZURE")) return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "💻 Azure" };
  if (h.includes("DEVOPS")) return { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", label: "⚙️ DevOps" };
  if (h.includes("TERRAFORM")) return { bg: "bg-violet-500/10 text-violet-400 border-violet-500/20", label: "☁️ Terraform" };
  if (h.includes("LINUX")) return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "🐧 Linux" };
  if (h.includes("INTERVIEW")) return { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "🎯 Interview" };
  if (h.includes("CAREER") || h.includes("HIRING") || h.includes("JOB")) return { bg: "bg-teal-500/10 text-teal-400 border-teal-500/20", label: "💼 Career" };
  if (h.includes("AI") || h.includes("ML") || h.includes("OPENAI") || h.includes("CHATGPT") || h.includes("GENAI")) return { bg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20", label: "✨ AI" };
  if (h.includes("NETWORK")) return { bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", label: "🌐 Networking" };
  return { bg: "bg-white/5 text-white/60 border-white/10", label: heading || "LinkedIn Post" };
};



export function LPCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  const embedUrl = getLinkedInEmbedUrl(item.url);
  const extractedTopic = extractTopicFromLinkedInUrl(item.url);

  return (
    <div
      className="group h-[500px] flex flex-col relative overflow-hidden rounded-xl bg-[#1d2226] border border-[#38434f] hover:border-[#4b5563] transition-all cursor-pointer"
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
                   <img loading="lazy" src={item.thumbnail} alt="Post image" className="w-full h-auto max-h-64 object-contain" />
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export function BlogCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      {item.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5">
             <img loading="lazy" src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase">
                <FileText className="w-3.5 h-3.5 text-orange-400" /> Blog
                {item.platform && (
                    <>
                        <span>•</span>
                        {item.platform}
                    </>
                )}
             </div>
             
             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 ${item.starred ? "text-amber-400" : "text-white/40 hover:text-white"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
              </button>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
}

export function EmailCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_0_40px_rgba(168,85,247,0.05)] transition-all duration-500 cursor-pointer flex flex-col p-5"
      onClick={onClick}
    >
        <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-purple-400/70 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                Contact • {item.date || "Just now"}
             </div>
             
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 ${item.starred ? "text-amber-400" : "text-white/40 hover:text-white"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star className="w-3.5 h-3.5" fill={item.starred ? "currentColor" : "none"} />
              </button>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
            <p className="text-sm text-white/50 mt-4 line-clamp-2 leading-relaxed font-light border-t border-white/5 pt-4">
                {item.description}
            </p>
        )}
    </div>
  );
}

export function GitCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col p-4"
      onClick={onClick}
    >
        <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2 text-xs text-[#848d97]">
                <Github className="w-4 h-4 text-[#848d97]" />
                {item.author}
             </div>
             
             <div className="flex items-center gap-2">
               <button
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[#21262d] ${item.starred ? "text-amber-400" : "text-[#848d97]"}`}
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

        <div className="flex items-start gap-3">
          <div className="flex flex-col flex-1 min-w-0">
             <h3 className="text-base font-semibold text-[#2f81f7] truncate group-hover:underline">
                {item.title}
             </h3>
          </div>
        </div>
        
        {item.description && (
            <p className="text-sm text-[#848d97] line-clamp-3 mt-2">
                {item.description}
            </p>
        )}

        <div className="flex items-center gap-4 mt-auto pt-4 text-xs text-[#848d97]">
           {item.language && (
             <span className="flex items-center gap-1.5">
               <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.language === 'TypeScript' ? '#3178c6' : item.language === 'JavaScript' ? '#f1e05a' : item.language === 'Python' ? '#3572A5' : item.language === 'Go' ? '#00ADD8' : '#8b5cf6' }}></span>
               <span>{item.language}</span>
             </span>
           )}
           {item.stars !== undefined && (
             <span className="flex items-center gap-1 hover:text-[#c9d1d9] transition-colors">
               <Star className="w-4 h-4" />
               {item.stars.toLocaleString()}
             </span>
           )}
           {item.forks !== undefined && (
             <span className="flex items-center gap-1 hover:text-[#c9d1d9] transition-colors">
               <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
               {item.forks.toLocaleString()}
             </span>
           )}
        </div>
    </div>
  );
}

export { TWCard } from "./TWCard";

export function IGCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group h-[500px] flex flex-col relative overflow-hidden rounded-xl bg-[#1d2226] border border-[#38434f] hover:border-[#4b5563] transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-3 border-b border-[#38434f] flex items-center justify-between shrink-0 bg-[#1d2226]">
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
              {item.title && item.title !== "Instagram Post" ? item.title : (item.heading ? "" : "Instagram Post")}
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
      
      <div className="flex-1 relative bg-white flex flex-col overflow-hidden">
         {item.shortcode ? (
           <>
             <LazyIframe
               src={`https://www.instagram.com/p/${item.shortcode}/embed`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="no"
               allowtransparency="true"
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             />
             {/* Invisible overlay to capture clicks and prevent iframe from stealing mouse events on dashboard */}
             <div className="absolute inset-0 z-10 bg-transparent hover:bg-black/5 transition-colors"></div>
           </>
         ) : (
             <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col bg-[#1d2226]">
               <div className="flex items-start gap-3 mb-3">
                   <div className="w-12 h-12 rounded-full bg-[#38434f] flex items-center justify-center shrink-0">
                      <Instagram className="w-6 h-6 text-[#b2b8bd]" />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-sm font-semibold text-white">
                          {item.title === "Instagram Post" ? "Instagram Post" : (item.title || "Instagram Post")}
                       </span>
                       <span className="text-xs text-[#b2b8bd]">{item.date || "Just now"}</span>
                   </div>
               </div>
               
               {item.description && item.description !== "Embedded Instagram Content" && (
                   <p className="text-sm text-white/90 mb-4 whitespace-pre-wrap leading-relaxed">
                       {item.description}
                   </p>
               )}
               
               {item.thumbnail ? (
                   <div className="rounded-lg overflow-hidden border border-[#38434f] mt-auto">
                       <img src={item.thumbnail} alt={item.title} className="w-full h-auto max-h-[300px] object-cover" loading="lazy" />
                   </div>
               ) : (
                   <div className="rounded-lg overflow-hidden border border-[#38434f] bg-black/20 flex flex-col items-center justify-center p-6 mt-auto min-h-[200px]">
                       <Instagram className="w-10 h-10 text-white/20 mb-3" />
                       <p className="text-sm text-white/40 font-medium text-center">Instagram Post</p>
                   </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
}
