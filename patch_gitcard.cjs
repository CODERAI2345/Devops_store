const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const startIndex = code.indexOf('export function GitCard');
const endIndex = code.indexOf('export function LPCard', startIndex) > -1 
  ? code.indexOf('export function LPCard', startIndex) 
  : code.indexOf('export function', startIndex + 20) > -1 
    ? code.indexOf('export function', startIndex + 20)
    : code.length;

const originalCode = code.slice(startIndex, endIndex);

const newGitCard = `export function GitCard({ item, onStar, onDelete, onCopy, onClick }: CardProps) {
  // Extract owner/repo
  let repoPath = "";
  try {
    const u = new URL(item.url);
    repoPath = u.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
  } catch (e) {
    repoPath = item.title || "";
  }

  const ogImageUrl = \`https://opengraph.githubassets.com/1/\${repoPath}\`;

  const formatNum = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div
      className="group h-[500px] relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e] transition-colors cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="flex justify-between items-center p-3 shrink-0">
         <div className="flex items-center gap-2 text-xs font-medium text-[#848d97]">
            <Github className="w-4 h-4 text-white" />
            GitHub Repository
         </div>
         
         <div className="flex items-center gap-2">
           <button
            className={\`w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[#21262d] \${item.starred ? "text-pink-500" : "text-[#848d97]"}\`}
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
         <img src={ogImageUrl} alt="Repository Banner" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
  );
}
`;

code = code.replace(originalCode, newGitCard);
fs.writeFileSync('src/components/Cards.tsx', code);
