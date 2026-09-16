const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldSelect = `className="w-full max-w-[200px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-orange-500/50 focus:outline-none transition-all appearance-none"`;
const newSelect = `className="w-full max-w-[200px] bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 focus:bg-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 focus:outline-none transition-all appearance-none cursor-pointer"`;

code = code.replace(oldSelect, newSelect);
fs.writeFileSync('src/App.tsx', code);
