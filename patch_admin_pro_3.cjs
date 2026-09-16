const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHeader = `<div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-display text-white">
                    Manage Collection
                  </h2>
                  <div className="text-sm text-white/40">{db[adminTab].length} items</div>
                </div>`;
const newHeader = `<div className="flex items-center justify-between mb-4 border-b border-[#27272A] pb-4">
                  <h2 className="text-sm font-medium text-[#EDEDED]">
                    Manage Collection
                  </h2>
                  <div className="text-sm text-[#A1A1AA] bg-[#27272A]/50 px-2.5 py-0.5 rounded-full">{db[adminTab].length} items</div>
                </div>`;
code = code.replace(oldHeader, newHeader);

const oldRow = `className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group"`;
const newRow = `className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-transparent border border-[#27272A] rounded-md cursor-pointer hover:border-[#3F3F46] hover:bg-[#09090B] transition-colors group mb-2"`;
code = code.replace(oldRow, newRow);

const oldItemText = `className="font-medium text-white/90 truncate group-hover:text-white transition-colors"`;
const newItemText = `className="text-sm font-medium text-[#EDEDED] truncate"`;
code = code.split(oldItemText).join(newItemText);

const oldItemUrl = `className="text-xs text-white/40 truncate mt-1"`;
const newItemUrl = `className="text-xs text-[#A1A1AA] truncate mt-0.5"`;
code = code.split(oldItemUrl).join(newItemUrl);

const oldInputs = `className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"`;
const newInputs = `className="w-full max-w-[300px] bg-transparent border border-transparent hover:border-[#27272A] focus:border-[#EDEDED] focus:bg-[#09090B] rounded-md px-3 py-1.5 text-sm text-[#EDEDED] placeholder-[#71717A] focus:outline-none transition-colors"`;
code = code.split(oldInputs).join(newInputs);

const oldSelect = `className="w-full max-w-[200px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-orange-500/50 focus:outline-none transition-all appearance-none"`;
const newSelect = `className="w-full max-w-[200px] bg-transparent border border-transparent hover:border-[#27272A] focus:border-[#EDEDED] focus:bg-[#09090B] rounded-md px-3 py-1.5 text-sm text-[#EDEDED] focus:outline-none transition-colors appearance-none cursor-pointer"`;
code = code.split(oldSelect).join(newSelect);

fs.writeFileSync('src/App.tsx', code);
