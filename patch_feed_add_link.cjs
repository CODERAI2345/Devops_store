const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// We need to inject the "Add Link" bar into the Main Content of the Feed.
// We will look for `<main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">`
// and insert the sleek bar right after it.

const addLinkBar = `
             {/* Premium Add Link Bar */}
             <div className="mb-10 w-full max-w-3xl mx-auto">
               <div className="relative group flex items-center bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden">
                 {/* Inner glow effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="pl-4 pr-2 text-white/40">
                   <LinkIcon className="w-5 h-5" />
                 </div>
                 <input
                   className="flex-1 bg-transparent border-none text-white text-base py-3 px-2 placeholder-white/30 focus:outline-none focus:ring-0 z-10"
                   placeholder="Paste a link to save to your collection..."
                   value={linkInput}
                   onChange={(e) => setLinkInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && linkInput.trim()) {
                       setAdminTab(classifyUrl(linkInput) || currentTab);
                       setShowAdminModal(true);
                     }
                   }}
                 />
                 <button 
                   onClick={() => {
                     if (linkInput.trim()) {
                       setAdminTab(classifyUrl(linkInput) || currentTab);
                       setShowAdminModal(true);
                     } else {
                       // Just open modal empty
                       setShowAdminModal(true);
                     }
                   }}
                   className="relative z-10 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full transition-colors text-sm border border-white/5 whitespace-nowrap"
                 >
                   Add Link
                 </button>
               </div>
             </div>
`;

content = content.replace(
  /<main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">/,
  '<main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">\n' + addLinkBar
);

fs.writeFileSync('src/App.tsx', content);
console.log('Add link bar injected.');
