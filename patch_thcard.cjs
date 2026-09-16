const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const oldTH = `<div className="flex-1 relative bg-white flex flex-col overflow-hidden">
         {item.shortcode ? (
           <>
             <LazyIframe
               src={\`https://www.threads.net/t/\${item.shortcode}/embed\`}
               width="100%"
               height="100%"
               frameBorder="0"
               scrolling="yes"
               allow="encrypted-media"
               className="w-full h-full absolute inset-0 bg-white"
             />
           </>
         ) : (
             <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                 <span className="text-white/20 text-xs text-center px-4">Thread Preview<br/>Unavailable</span>
             </div>
         )}
      </div>`;

const newTH = `<div className="flex-1 relative bg-[#1a1a1a] flex flex-col overflow-y-auto p-4 custom-scrollbar">
         {item.thumbnail ? (
           <img src={item.thumbnail} alt="Threads content" className="w-full h-auto rounded-lg mb-4 object-contain max-h-[250px] bg-black/50" />
         ) : null}
         <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {item.description !== "Embedded Threads Content" && item.description !== "Threads • Log in" ? item.description : "View thread on Threads.net"}
         </div>
      </div>`;

code = code.replace(oldTH, newTH);
fs.writeFileSync('src/components/Cards.tsx', code);
