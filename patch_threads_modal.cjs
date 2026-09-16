const fs = require('fs');

let content = fs.readFileSync('src/components/ThreadsModal.tsx', 'utf-8');

// Update Backdrop to match main Modal
content = content.replace(
  /className="absolute inset-0 bg-black\/30 backdrop-blur-xl animate-in fade-in duration-300"/,
  'className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"'
);

// Update Container width to match standard reading width
content = content.replace(
  /className="relative w-full max-w-\[400px\] h-full max-h-\[92vh\] flex flex-col animate-in zoom-in-95 duration-300 z-10"/,
  'className="relative w-full max-w-2xl max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 sm:max-w-[600px] xl:max-w-[700px] z-10 overflow-hidden"'
);

// Update Header to match main modal
content = content.replace(
  /className="flex items-center justify-between px-5 py-4 shrink-0 z-20"/,
  'className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20"'
);

// Update Header icons wrapper
content = content.replace(
  /className="w-8 h-8 rounded-full bg-white\/\[0\.05\] flex items-center justify-center font-bold text-sm text-white"/,
  'className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white border border-white/20"'
);

// Remove the old Content Container flex-1 wrapper and apply directly to make it scrollable
content = content.replace(
  /<div \s*ref=\{containerRef\}\s*className="flex-1 w-full flex items-center justify-center overflow-hidden relative"\s*>\s*<div className="flex flex-col h-full w-full bg-\[\#121212\] rounded-2xl border border-white\/10 overflow-hidden">/g,
  '<div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-transparent"><div className="flex flex-col w-full">'
);

// Fix inner image wrapper
content = content.replace(
  /<div className="w-full relative bg-black\/50 flex items-center justify-center border-b border-white\/10 flex-1 min-h-0">/,
  '<div className="w-full relative bg-black/50 flex items-center justify-center border-b border-white/10 min-h-[400px]">'
);

// Fix inner text area
content = content.replace(
  /<div className="p-5 flex flex-col gap-3 shrink-0 bg-\[\#121212\] max-h-\[35%\] overflow-y-auto custom-scrollbar">/,
  '<div className="p-8 flex flex-col gap-4 bg-transparent">'
);
content = content.replace(
  /className="text-sm text-white\/80 whitespace-pre-wrap leading-relaxed"/,
  'className="text-base text-white/80 whitespace-pre-wrap leading-relaxed font-light"'
);

// Update Footer wrapper to match main modal
content = content.replace(
  /<div className="mt-4 shrink-0 z-20">/,
  '<div className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20">'
);

// Update Footer button to match main modal
content = content.replace(
  /className="w-full py-3 rounded-full bg-black\/20 text-black shadow-lg text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-\[0_0_20px_rgba\(217, 70, 239, 0\.3\)\]"/,
  'className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/25 w-full"'
);

fs.writeFileSync('src/components/ThreadsModal.tsx', content);
console.log('ThreadsModal patched.');
