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

// Clean up text sizes
const oldItemText = `className="font-medium text-white/90 truncate group-hover:text-white transition-colors"`;
const newItemText = `className="text-sm font-medium text-[#EDEDED] truncate"`;
code = code.split(oldItemText).join(newItemText);

const oldItemUrl = `className="text-xs text-white/40 truncate mt-1"`;
const newItemUrl = `className="text-xs text-[#A1A1AA] truncate mt-0.5"`;
code = code.split(oldItemUrl).join(newItemUrl);

const oldItemDateText = `className="text-xs text-white/40 text-right mt-1 sm:mt-0 whitespace-nowrap"`;
const newItemDateText = `className="text-xs text-[#A1A1AA] text-right mt-1 sm:mt-0 whitespace-nowrap"`;
code = code.split(oldItemDateText).join(newItemDateText);

fs.writeFileSync('src/App.tsx', code);
