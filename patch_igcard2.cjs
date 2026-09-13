const fs = require('fs');
let code = fs.readFileSync('src/components/Cards.tsx', 'utf-8');

const targetStr = `      <div className="flex-1 relative bg-[#1d2226] flex flex-col">
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
                     <p className="text-sm text-white/40 font-medium">Click card to play/view in iframe popup</p>
                 </div>
             )}
          </div>
      </div>`;

const replaceStr = `      <div className="flex-1 relative bg-white flex flex-col overflow-hidden">
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
      </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/Cards.tsx', code);
