const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHeader = `<div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-display font-bold text-white">
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

// Now for the rows
const oldRow = `className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group"`;
const newRow = `className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-transparent border border-[#27272A] rounded-md cursor-pointer hover:border-[#3F3F46] hover:bg-[#09090B] transition-colors group mb-2"`;
code = code.replace(oldRow, newRow);

fs.writeFileSync('src/App.tsx', code);
