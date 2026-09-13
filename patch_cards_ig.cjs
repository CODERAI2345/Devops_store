const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const oldIGCard = `export function IGCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-square sm:aspect-video w-full overflow-hidden bg-black/40">
        {item.thumbnail ? (
          <img loading="lazy"
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-black/40 p-4 text-center">
            <Instagram className="w-12 h-12 text-pink-400 mb-3" />
            <div className="text-sm font-medium text-white/60">Click to add details</div>
            <div className="text-xs text-white/40 mt-1">Instagram blocks auto-fetching</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           <button
            className={\`w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 \${item.starred ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-white/70 hover:text-white hover:bg-white/20"}\`}
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
          <button
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-white/20 border border-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40 uppercase mb-2">
           <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram
           <span>•</span>
           {item.date || "Just now"}
        </div>
        <h3 className="text-sm font-medium text-white/90 leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
          {item.title === "Instagram Post" ? "Instagram Post (Needs Details)" : (item.title || "Instagram Post")}
        </h3>
        {item.description && item.description !== "Embedded Instagram Content" ? (
           <p className="text-xs text-white/50 mt-2 line-clamp-2">
             {item.description}
           </p>
        ) : (
           <p className="text-xs text-orange-400/70 mt-2 line-clamp-2 flex items-center gap-1">
             <Edit2 className="w-3 h-3" /> Tap to manually tag this post
           </p>
        )}
      </div>
    </div>
  );
}`;

const newIGCard = `export function IGCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
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
            <span className="text-xs font-semibold text-[#b2b8bd]">
              Instagram Post
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
            <button
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 \${item.starred ? "text-amber-400 bg-amber-400/10" : "text-[#b2b8bd] hover:bg-[#38434f]"}\`}
            >
                <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:bg-[#38434f] shrink-0"
            >
                <Copy className="w-4 h-4" />
            </button>
             <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[#b2b8bd] hover:text-red-400 hover:bg-[#38434f] shrink-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#1d2226] flex flex-col">
          <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col">
             <div className="flex items-start gap-3 mb-3">
                 <div className="w-12 h-12 rounded-full bg-[#38434f] flex items-center justify-center shrink-0">
                    <Instagram className="w-6 h-6 text-[#b2b8bd]" />
                 </div>
                 <div className="flex flex-col">
                     <span className="text-sm font-semibold text-white hover:text-pink-400 hover:underline cursor-pointer">
                        {item.title === "Instagram Post" ? "Instagram Post (Needs Details)" : (item.title || "Instagram Post")}
                     </span>
                     <span className="text-xs text-[#b2b8bd]">{item.date || "Just now"}</span>
                 </div>
             </div>
             
             {item.description && item.description !== "Embedded Instagram Content" ? (
                 <p className="text-sm text-white/90 mb-4 whitespace-pre-wrap leading-relaxed">
                     {item.description}
                 </p>
             ) : (
                <p className="text-sm text-orange-400/70 mb-4 whitespace-pre-wrap leading-relaxed flex items-center gap-1">
                   <Edit2 className="w-4 h-4" /> Tap to manually tag this post
                </p>
             )}
             
             {item.thumbnail ? (
                 <div className="rounded-lg overflow-hidden border border-[#38434f] mt-auto">
                     <img src={item.thumbnail} alt={item.title} className="w-full h-auto max-h-[300px] object-cover" loading="lazy" />
                 </div>
             ) : (
                 <div className="rounded-lg overflow-hidden border border-[#38434f] bg-black/20 flex flex-col items-center justify-center p-6 mt-auto min-h-[200px]">
                     <Instagram className="w-10 h-10 text-white/20 mb-3" />
                     <p className="text-sm text-white/40 font-medium">Click card to play/view in iframe popup</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}`;

code = code.replace(oldIGCard, newIGCard);
fs.writeFileSync('src/components/Cards.tsx', code);
