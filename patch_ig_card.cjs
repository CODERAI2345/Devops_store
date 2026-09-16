const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const oldIGCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col overflow-y-auto p-4 custom-scrollbar">
         {item.thumbnail && item.thumbnail !== "" ? (
           <img src={item.thumbnail} alt="Instagram content" className="w-full h-auto rounded-lg mb-4 object-contain max-h-[250px] bg-black/50 border border-white/5" />
         ) : null}
         <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {item.description && item.description !== "Embedded Instagram Content" && !item.description.includes("Join Threads") ? item.description : "View on Instagram"}
         </div>
         <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full w-max">
            Open on Instagram
         </a>
      </div>`;

const newIGCard = `      <div className="flex-1 relative bg-[#1a1a1a] flex flex-col">
         {item.shortcode ? (
            <LazyIframe
              src={\`https://www.instagram.com/p/\${item.shortcode}/embed/captioned\`}
              title="Instagram embed"
              className="w-full h-full absolute inset-0 bg-white"
            />
         ) : (
            <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar flex flex-col">
               {item.thumbnail && item.thumbnail !== "" ? (
                 <img src={item.thumbnail} alt="Instagram content" className="w-full h-auto rounded-lg mb-4 object-contain max-h-[250px] bg-black/50 border border-white/5" />
               ) : null}
               <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                  {item.description && item.description !== "Embedded Instagram Content" && !item.description.includes("Join Threads") ? item.description : "View on Instagram"}
               </div>
               <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-full w-max">
                  Open on Instagram
               </a>
            </div>
         )}
      </div>`;

code = code.replace(oldIGCard, newIGCard);
fs.writeFileSync('src/components/Cards.tsx', code);
