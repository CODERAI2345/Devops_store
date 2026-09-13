const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const oldIGCardMatch = code.match(/export function IGCard.*?\}\);\n\}/s);
if (oldIGCardMatch) {
  const newIGCard = `export function IGCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  return (
    <div
      className="group h-[500px] flex flex-col relative overflow-hidden rounded-xl bg-[#1d2226] border border-[#38434f] hover:border-[#4b5563] transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-3 border-b border-[#38434f] flex items-center justify-between shrink-0 bg-[#1d2226] z-20 relative">
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
        </div>
      </div>
      
      <div className="flex-1 relative bg-white flex flex-col overflow-hidden">
         {item.shortcode ? (
           <>
             <iframe
               src={\`https://www.instagram.com/p/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="no"
               allowTransparency={true}
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             ></iframe>
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
}`;
  code = code.replace(oldIGCardMatch[0], newIGCard);
  fs.writeFileSync('src/components/Cards.tsx', code);
}
