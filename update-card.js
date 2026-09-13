import fs from 'fs';
let code = fs.readFileSync('src/components/Cards.tsx', 'utf8');

const newLPCard = `export function LPCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  const embedUrl = getLinkedInEmbedUrl(item.url);

  return (
    <div
      className="group h-[500px] flex flex-col relative overflow-hidden rounded-[20px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 backdrop-blur-xl"
      onClick={onClick}
    >
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Linkedin className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white/90 truncate">{item.title || "LinkedIn Post"}</span>
            <span className="text-xs text-white/40 truncate">{item.date || "Recent"}</span>
          </div>
        </div>
        
        <div className="flex gap-1 items-center">
            <button
                onClick={(e) => { e.stopPropagation(); onStar(); }}
                className={\`w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 shrink-0 \${item.starred ? "text-amber-400 bg-amber-400/10" : "text-white/40 hover:text-white"}\`}
            >
                <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white/40 hover:text-white hover:bg-white/10 shrink-0"
            >
                <Copy className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-black/20">
        {embedUrl ? (
          <iframe loading="lazy"
            src={embedUrl}
            height="100%"
            width="100%"
            frameBorder="0"
            allowFullScreen
            title="Embedded post"
            className="w-full h-full absolute inset-0"
            style={{ overflowY: 'auto' }}
          />
        ) : (
          <div className="absolute inset-0 p-5 overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-medium text-white/90 mb-2 leading-relaxed">
              {item.heading && <span className="text-blue-400 mr-2">{item.heading}</span>}
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 flex items-center justify-between gap-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 font-medium text-sm hover:bg-blue-500/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open post</span>
        </a>
      </div>
    </div>
  );
}`;

const regex = /export function LPCard\(\{.*?\}: CardProps\) \{[\s\S]*?(?=export function BlogCard)/;
code = code.replace(regex, newLPCard);

fs.writeFileSync('src/components/Cards.tsx', code);
