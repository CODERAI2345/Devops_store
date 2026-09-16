const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the cream section inside Admin
content = content.replace(
  /<div className="bg-black\/20\/80 border border-white\/10 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">\s*<div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-purple-50 pointer-events-none" \/>/g,
  '<div className="bg-[#09090B] border border-[#27272A] rounded-xl p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">'
);

// Fix the little bar icon and heading color
content = content.replace(
  /<h2 className="text-lg font-semibold mb-6 flex items-center gap-2">\s*<div className="w-2 h-4 bg-black\/20 rounded-sm" \/>/g,
  '<h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[#EDEDED]">\n                 <div className="w-2 h-4 bg-fuchsia-500 rounded-sm" />'
);

// Fix the input and button styles
content = content.replace(
  /className="flex-1 bg-\[\#09090B\] border border-\[\#27272A\] rounded-md px-4 py-2\.5 text-sm text-white placeholder-\[\#71717A\] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-sm"/g,
  'className="flex-1 bg-[#18181B] border border-[#27272A] rounded-md px-4 py-2.5 text-sm text-[#EDEDED] placeholder-[#71717A] focus:outline-none focus:border-[#EDEDED] transition-all shadow-sm"'
);

content = content.replace(
  /className="px-6 py-2\.5 bg-black\/20 text-black hover:bg-gray-200 font-medium rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-\[100px\] shadow-sm"/g,
  'className="px-6 py-2.5 bg-[#EDEDED] text-[#09090B] hover:bg-white font-medium rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] shadow-sm"'
);


fs.writeFileSync('src/App.tsx', content);
console.log('Admin cream section patched.');
