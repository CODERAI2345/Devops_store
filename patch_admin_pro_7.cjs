const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldHeader = `<div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">
                    Manage Collection
                  </h2>
                  <div className="text-sm text-white/40">{db[adminTab].length} items</div>
                </div>`;
const newHeader = `<div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-medium text-[#EDEDED]">
                    Manage Collection
                  </h2>
                  <div className="text-xs font-medium text-[#A1A1AA] bg-[#27272A]/50 px-2.5 py-0.5 rounded-full">{db[adminTab].length} items</div>
                </div>`;
code = code.replace(oldHeader, newHeader);

const oldDeleteBtn = `className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors shrink-0 ml-4"`
const newDeleteBtn = `className="p-2 text-[#71717A] hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors shrink-0 ml-4 border border-transparent hover:border-red-500/20"`
code = code.split(oldDeleteBtn).join(newDeleteBtn);

fs.writeFileSync('src/App.tsx', code);
