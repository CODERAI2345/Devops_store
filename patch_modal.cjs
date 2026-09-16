const fs = require('fs');

let content = fs.readFileSync('src/components/Modal.tsx', 'utf-8');

// Container
content = content.replace(
  /<div className="fixed inset-0 z-\[100\] flex justify-end">/,
  '<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">'
);

// Backdrop
content = content.replace(
  /className="absolute inset-0 bg-black\/30 backdrop-blur-sm animate-in fade-in duration-300"/,
  'className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"'
);

// Panel (slide-in -> zoom-in, h-full -> h-full max-h-[90vh], bg-[#0d1117] -> bg-[#0d1117] rounded-2xl)
content = content.replace(
  /className="relative w-full max-w-2xl h-full bg-\[\#0d1117\] border-l border-white\/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 sm:max-w-\[600px\] xl:max-w-\[700px\] z-10"/,
  'className="relative w-full max-w-2xl max-h-[90vh] bg-[#060816] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 sm:max-w-[600px] xl:max-w-[700px] z-10 overflow-hidden"'
);

// Header
content = content.replace(
  /className="flex items-center justify-between px-6 py-4 border-b border-white\/10 shrink-0 bg-\[\#0d1117\]\/80 backdrop-blur-md z-20"/,
  'className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02] backdrop-blur-md z-20"'
);

// Body scroll area (check if there's a specific bg)
// Looking at the component, there's no specific bg on the body container, it relies on the parent's bg-[#0d1117]. I changed the parent bg to #060816.

// Footer
content = content.replace(
  /className="px-6 py-5 border-t border-white\/10 bg-\[\#0d1117\]\/80 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20"/,
  'className="px-6 py-5 border-t border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-20"'
);

fs.writeFileSync('src/components/Modal.tsx', content);

console.log('Modal patched.');
