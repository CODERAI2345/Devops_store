const fs = require('fs');

let content = fs.readFileSync('src/components/InstagramModal.tsx', 'utf-8');

// Update Backdrop to match main Modal
content = content.replace(
  /className="absolute inset-0 bg-black\/30 backdrop-blur-xl animate-in fade-in duration-300"/,
  'className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"'
);

// Update Container width to match standard reading width
content = content.replace(
  /className="relative w-full max-w-\[400px\] flex flex-col animate-in zoom-in-95 duration-300 z-10"/,
  'className="relative w-full max-w-2xl max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 sm:max-w-[600px] xl:max-w-[700px] z-10 overflow-hidden"'
);

// Update Header to match main modal
content = content.replace(
  /className="flex items-center justify-between px-5 py-4 shrink-0 z-20"/,
  'className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20"'
);


// Update Footer wrapper to match main modal
content = content.replace(
  /<div className="mt-4 shrink-0 z-20">/,
  '<div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">'
);

// Update Footer button to match main modal
content = content.replace(
  /className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-\[0_0_20px_rgba\(236,72,153,0\.3\)\]"/,
  'className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 w-full"'
);

fs.writeFileSync('src/components/InstagramModal.tsx', content);
console.log('InstagramModal patched.');
