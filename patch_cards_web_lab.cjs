const fs = require('fs');

let content = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const webAndLabCards = `
  if (item.type === "web") {
    let domain = "website.com";
    try {
      domain = new URL(item.url).hostname.replace('www.', '');
    } catch(e) {}
    
    const favicon = \`https://s2.googleusercontent.com/s2/favicons?domain=\${domain}&sz=128\`;
    return (
      <div 
        key={item.id}
        onClick={onClick}
        className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/50 hover:shadow-[inset_0_1px_0_0_rgba(167,139,250,0.6),0_8px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      >
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${item.starred ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" : "bg-black/40 text-white/40 hover:text-white border border-white/10"}\`}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="p-6 flex gap-4 items-center border-b border-white/5 bg-gradient-to-r from-white/[0.04] to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0 p-2.5">
            <img src={favicon} alt={domain} className="w-full h-full object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
            <Globe2 className="w-6 h-6 text-white/40 hidden" />
          </div>
          <div className="flex flex-col pr-8">
            <h3 className="font-bold text-white text-lg truncate group-hover:text-violet-400 transition-colors">{item.title || domain}</h3>
            <span className="text-sm text-white/50 truncate flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {domain}</span>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
           <p className="text-sm text-white/70 line-clamp-3 leading-relaxed mb-4">{item.description || "A saved website from your DevOps journey."}</p>
           <div className="flex flex-wrap gap-2 mt-auto">
             {((item as any).tags || []).map((t: string) => (
                <span key={t} className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">{t}</span>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (item.type === "lab") {
    let domain = "Course Platform";
    try {
      domain = new URL(item.url).hostname.replace('www.', '').split('.')[0];
      domain = domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch(e) {}
    
    return (
      <div 
        key={item.id}
        onClick={onClick}
        className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] hover:border-violet-500/50 hover:shadow-[inset_0_1px_0_0_rgba(167,139,250,0.6),0_8px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
      >
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${item.starred ? "bg-amber-400/20 text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-black/60 text-white/60 hover:text-white border border-white/20 backdrop-blur-md"}\`}
          >
            <Star className="w-4 h-4" fill={item.starred ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="w-full aspect-video bg-gradient-to-br from-violet-900/40 to-[#060816] relative border-b border-white/10 flex items-center justify-center overflow-hidden">
           {item.thumbnail ? (
              <img src={item.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
           ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <PlayCircle className="w-8 h-8 text-fuchsia-400" />
                 </div>
              </div>
           )}
           <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-black/50">
             <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {(item as any).difficulty || "Hands-on"}
           </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
           <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-fuchsia-400 transition-colors">{item.title || "Interactive Lab Course"}</h3>
           <p className="text-sm text-white/50 mb-4 line-clamp-1 flex items-center gap-1.5">
             {domain} <span className="text-white/20">•</span> {item.author || "Instructor"}
           </p>
           
           <div className="flex items-center justify-between text-xs font-semibold text-white/50 mt-auto pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-emerald-400"><Clock className="w-3.5 h-3.5" /> {(item as any).duration || "Self-paced"}</span>
              <span className="flex items-center gap-1.5 text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md border border-violet-500/20"><Copy className="w-3 h-3" /> Lab Environment</span>
           </div>
        </div>
      </div>
    );
  }
`;

// Insert the new cards before the return null at the end of the HubCard component
content = content.replace(/  return null;\n\}/, webAndLabCards + '\n  return null;\n}');

// Also need to make sure LinkIcon is imported if not already. We will use 'Link as LinkIcon' in the imports if it's there.
// Let's check imports.
if (!content.includes('LinkIcon')) {
  content = content.replace(/import \{/, 'import { Link as LinkIcon,');
}

fs.writeFileSync('src/components/Cards.tsx', content);
console.log('Cards patched.');
