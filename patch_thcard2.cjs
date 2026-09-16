const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const regex = /<div className="flex-1 relative bg-white flex flex-col overflow-hidden">[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;

const newTH = `<div className="flex-1 relative bg-[#1a1a1a] flex flex-col overflow-y-auto p-4 custom-scrollbar">
         {item.thumbnail && item.thumbnail !== "" ? (
           <img src={item.thumbnail} alt="Threads content" className="w-full h-auto rounded-lg mb-4 object-contain max-h-[250px] bg-black/50 border border-white/5" />
         ) : null}
         <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {item.description && item.description !== "Embedded Threads Content" && !item.description.includes("Join Threads") ? item.description : "View thread on Threads.net"}
         </div>
         <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full w-max">
            Open in Threads
         </a>
      </div>
    </div>
  );
}`;

code = code.replace(regex, newTH);
fs.writeFileSync('src/components/Cards.tsx', code);
